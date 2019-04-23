const express = require('express');
const router = express.Router();

// require User to update postID (backend) for his/her post
// require HousePost to post house on database
const User = require('../models/user-model');
const HousePost = require('../models/house-post-model');

// '/house-post' can be named anything, just know this one is for the backend as opposed to the frontend.
router.post('/house-post', (req, res, next) => {
  const { title, image, address, houseType, squareFeet, totalRooms, totalBathrooms, parking, petsAllowed, price, description } = req.body;
  // declare user variable to be able to refer to req.user._id to update post    
  const user = req.user

    if (title == '' || image == '' || address == '' || houseType == '' || squareFeet == '' || totalRooms == '' || totalBathrooms == '' || parking == '' || petsAllowed == '' || price == '' || description == ''){
      res.status(401).json({ message: "All fields must be filled!"})
    }

    HousePost.create({ title, image, address, houseType, squareFeet, totalRooms, totalBathrooms, parking, petsAllowed, price, description })
    .then(housePost => {

      res.json(housePost)
      User.findById(user._id)
      .then(foundUser => {
        foundUser.posts.houses.push(housePost) // NEED TO REVIEW
        foundUser.save();
      })
      .catch(err => next(err));
    })
    .catch( err => next(err) );
})

module.exports = router;



// const express = require('express');
// const router  = express.Router();

// const Phone = require('../models/phone-model');

// router.post('/phones', (req, res, next) => {
//   const { brand, model, price, image, specs } = req.body;

//   // if(brand == '' || model == '' || price == '', image == '', specs == ''){
//   //   res.status(401).json({ message: "All fields must be filled!" })
//   // }

//   Phone.create({ brand, model, price, image, specs })
//   .then(phoneDoc => res.json(phoneDoc))
//   .catch( err => next(err) );
// });

// // .get() => get the list of phones from the DB
// router.get('/phones', (req, res, next) => {
//   Phone.find()
//   .sort({ createdAt: -1 })
//   .limit(10)
//   // send the received results from the DB as JSON to the client
//   .then( phonesFromDB => res.json(phonesFromDB) )
//   .catch( err => next(err) );
// });

// module.exports = router;
