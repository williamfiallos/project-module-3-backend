const express = require('express');
const router = express.Router();







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
