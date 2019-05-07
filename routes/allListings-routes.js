const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const CarPost = require("../models/car-post-model");
const HousePost = require("../models/house-post-model");
const User = require("../models/user-model");

router.get("/all-listings", (req, res, next) => {
  const allListings = [];

  CarPost.find()
    .then(allCars => {
      allListings.push(...allCars);
      HousePost.find()
        .then(allHouses => {
          allListings.push(...allHouses);
          res.json(allListings);
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get("/my-listings", (req, res, next) => {
  

  User.findOne(req.user._id)
    .populate({ path: "posts.cars"})
    .populate({ path: "posts.houses" })
    .then( foundUser => {
      // console.log("found User: ", foundUser.posts);
      res.json(foundUser.posts);
    })
    .catch(error => next(error));
});

module.exports = router;
