const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const CarPost = require("../models/car-post-model");
const HousePost = require("../models/house-post-model");

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

module.exports = router;
