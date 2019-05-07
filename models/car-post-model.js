const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carPostSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    postType: {
      type: String,
      default: "car"
    },
    title: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true
    }],
    condition: {
      type: String,
      require: true
    },
    cylinders: {
      type: String,
      require: true
    },
    drive: {
      type: String,
      required: true
    },
    fuel: {
      type: String,
      required: true
    },
    odometer: {
      type: String,
      required: true
    },
    paintColor: {
      type: String,
      required: true
    },
    transmission: {
      type: String,
      required: true
    },
    type: {
      type: String,
      // can only be one of the following options
      enum: ["Coupe", "Convertible", "Sedan", "Hatchback", "Crossover", "SUV"]
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    price: {
      type: Number,
      required: true
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("CarPost", carPostSchema);
