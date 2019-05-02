const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user-model');
const CarPost = require('../models/car-post-model');


// POST route for new CarPost
router.post('/car-post', (req,res,next) => {

  
  const {title, images, condition, cylinders, drive, fuel, odometer, paintColor, transmission, type, description, price } = req.body;
  const user = req.user._id

  if(title == '' || !images || condition == '' || cylinders == '' || drive == '' || fuel == '' || odometer == '' || paintColor == '' || transmission == '' || type == '' || description == '' || price == '') {
    res.status(401).json({message: "Please enter all feilds"})

  }

  CarPost.create({title, images, condition, cylinders, drive, fuel, odometer, paintColor, transmission, type, description, price})
  .then(carPost => {
  res.json(carPost)

  User.findById(user)
  .then(foundUser => {
    foundUser.posts.cars.push(carPost)
    foundUser.save()
  })
  .catch(error => next(error)) // closes User.findById
  })
  .catch(error => next(error)) // cloes CarPost.create
})


// GET route to display all cars
router.get('/all-cars', (req,res,next) => {
  CarPost.find()
  .then(foundCarPost => res.json(foundCarPost))
  .catch(error => next(error))
})


// GET route to display car detail
router.get('/car-details/:id', (req,res,next) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  CarPost.findById(req.params.id)
  .then(carDetails => res.json(carDetails))
  .catch(error => next(error))
})


// PUT route to update CarPost
router.put('/car-update/:id', (req,res,next) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  CarPost.findByIdAndUpdate(req.params.id, req.body)
  .then( () => res.json({message: `Car Post with id ${req.params.id} has been updated`}))
  .catch( error => next(error))

})


// DELETE route to delete CarPost
router.delete('/delete-car/:id', (req,res,next) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  CarPost.findOneAndDelete(req.params.id)
  .then(() => {
    res.json({message: `Car Post with id ${req.params.id} has been deleted!`})
    req.user.posts.cars.pull(req.params.id)
    req.user.save();
  })
  
  .catch(error => next(error))
})





module.exports = router;
