const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      // match: /^.+@.+\..+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 3
    },
    firstName: {
      type: String,
      required: true,
      minlength: 2
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2
    },
    phone: {
      type: Number,
      // not "required: true" for authentication for backend
    },
    profileImage: {
      type: String,
    }, 
    posts: {
      cars: [{
        type: Schema.Types.ObjectId, ref: 'CarPost'
      }],
      houses: [{
        type: Schema.Types.ObjectId, ref: 'HousePost'
      }]
    }
}, {
  timestamps: true
})

// const User = mongoose.model("User", userSchema);
// module.exports = User;
// same as below:

module.exports = mongoose.model("User", userSchema);