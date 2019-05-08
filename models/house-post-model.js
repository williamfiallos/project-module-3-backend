const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const housePostSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  postType: {
    type: String,
    default: "house"
  },
  title: {
    type: String,
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  address: {
    type: String,
    required: true
  },
  houseType: {
    type: String,
    enum: ["Apartment", "Condo", "Efficiency", "Studio", "Townhouse"],
    required: true
  },
  squareFeet: {
    type: Number,
    required: true,
    minlength: 3
  },
  totalRooms: {
    type: Number,
    required: true
  },
  totalBathrooms: {
    type: Number,
    required: true
  },
  parking: {
    type: Number,
    required: true
  },
  petsAllowed: {
    type: String,
    enum: ["Yes", "No"]
  },
  price: {
    type: Number,
    required: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    minlength: 20
  }
});

module.exports = mongoose.model("HousePost", housePostSchema);
