const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

// require User to update postID (backend) for his/her post
// require HousePost to post house on database
const User = require('../models/user-model');
const HousePost = require('../models/house-post-model');


///////////// POST ROUTE TO POST A HOUSE ////////////
// '/house-post' can be named anything, just know this one is for the backend as opposed to the frontend.
router.post('/house-post', (req, res, next) => {
  const { title, images, address, houseType, squareFeet, totalRooms, totalBathrooms, parking, petsAllowed, price, description } = req.body;
  // declare user variable to be able to refer to req.user._id to update post; req.user is given from the session 
  const user = req.user

    if (title == '' || !images || address == '' || houseType == '' || squareFeet == '' || totalRooms == '' || totalBathrooms == '' || parking == '' || petsAllowed == '' || price == '' || description == ''){
      res.status(401).json({ message: "All fields must be filled!"})
    }

    HousePost.create({ title, images, address, houseType, squareFeet, totalRooms, totalBathrooms, parking, petsAllowed, price, description })
    .then(housePost => {
      // send the received results from the DB as JSON to the client with res.json. Note: good practice to check 
      // if whether you send this before the first ".then" or before the first ".catch" to the frontend
      res.json(housePost)
      User.findById(req.user._id)
      .then(foundUser => {
        // console.log("foundUser", foundUser);
        foundUser.posts.houses.push(housePost) 
        foundUser.save();
      })
      .catch( err => next(err) ); // closes User.FindById
    })
    .catch( err => next(err) ); // closes HousePost
})


//////////// GET ROUTE TO DISPLAY ALL HOUSES /////////////
router.get('/all-houses', (req, res, next) => {
  // display all houses from DB (name required at the top)
  HousePost.find()
  .then(foundHousePosts => res.json(foundHousePosts))
  .catch( err => next(err) )
})


//////////// GET ROUTE TO SHOW DETAILS PAGE ////////////////
router.get('/house-details/:id', (req, res, next) => {
  // req.params comes from the URL!! we want the ID from the url
  // and note that ":id" is just a placeholder! 
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  HousePost.findById(req.params.id)
  .then(houseDetails => res.json(houseDetails))
  .catch( err => next(err) )
})

///////////// PUT ROUTE TO UPDATE HOUSE //////////////
// req.params from URL
// req.user from session
// req.body from the form
// send :id as parameter
router.put('/house-update/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  // NOTE: req.user stores user; req.params stores the url of parameter; req.body stores the form data!!!
  // NOTE: passing req.body because frontend form names match backend name model. otherwise it would be i.e houseType = type (destructure everything)
  HousePost.findByIdAndUpdate(req.params.id, req.body)
  // NOTE: send a message to client from DB notifying changes made, since no new post is being created.
  // remember the callback function is so that "UNTIL IT HAPPENS, THEN send message". 
  // Otherwise if not a callback function, html would simply read it and send a message (in object) without having updated anything.
  .then( () => res.json({ message: `House ${req.params.id} has been updated!` }) )
  .catch( err => next(err) )
})


/////////// DELETE ROUTE TO DELETE A HOUSE //////////////
router.delete('/delete-house/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  HousePost.findByIdAndDelete(req.params.id)
  // .then( () => res.json({ message: `House ${req.params.id} deleted!` }) )
  // note the fat arrow on a one-liner above does not require a curly brace; 
  // but on a multiple-liner you need curly brace to be able to get the whole as an object
  .then( () => {
    res.json({ message: `House ${req.params.id} deleted!` })
    // Now delete post from user. No need to go to user model, since user is in session already, therefore:
    req.user.posts.houses.pull(req.params.id)
    // Difference between ._id and .id is ._id is from the database, whereas .id is the placeholder of the URL!
    req.user.save() // remember the save method!
  })
  // no need for other .catch since there is no promise to update user.

  .catch( err => next(err) ) // closes the HousePost.findByIDAndDelete

})




module.exports = router;
