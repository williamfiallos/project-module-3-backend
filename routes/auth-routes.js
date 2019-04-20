const express = require('express');
const router  = express.Router();

const User = require('../models/user-model');

const passport = require('passport');

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

//////////// SIGN UP ///////////
router.post('/signup', (req, res, next) => {
  const { email, password, firstName, lastName, profileImage } = req.body;

  // if any of the below items are left blank, shoot error message. Note password.match requires to use a number from 0-9 (regular expression).
  if(firstName == '' || lastName == '' || email == '' || password.match(/[0-9]/) === null || password == '' || profileImage == ''){
    // send error JSON if any of the fields is empty or password doesn't contain a number
    res.status(401).json({ message: "All fields need to be filled and password must contain a number." })
    return;
  }

  User.findOne({ email })
  .then(foundUser => {
    if(foundUser !== null) {
      res.status(401).json({ message: "User's email already exists! Try a different email" })
      return 
    }
  })

  // encrypt the submitted password before saving
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  User.create({ firstName, lastName, email, password: encryptedPassword })
  .then(userInfo => {
    // if all good, log in the user automatically
    // "req.logIn()" is a Passport method that calls "serializeUser()"
    // (that saves the USER ID in the session)

        req.login(userInfo, () => { // NOTE CALLBACK FUNCTION is telling to don't do anything until it changes
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userInfo.password = undefined;
        res.json({ userInfo });
    })
    // this .catch is for User.create
    .catch( err => next(err) );
  })
  // this .catch is for User.findOne
  .catch( err => next(err) );
})

////////// LOGIN /////////
// LOGIN is a POST because we send information to the backend to compare, instead of a GET.
router.post('/login', (req, res, next) => {
  // LOGIN WITH PASSPORT-LOCAL-STRATEGY:
  passport.authenticate('local', (err, userInfo, failureDetails) => {

    if (err) {
      res.status(500).json({ message: 'Something went wrong in the server.' })
      return;
    }

    if (!userInfo) {
      // failureDetails is a method from the PASSPORT MODEL!!!!
      res.status(401).json(failureDetails);
      return;
    }

    req.login(userInfo, (err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong with server while login!' });
        return;
      }

      // We are now logged in (notice req.user) => we can send req.user since we have it available
      // or userInfo, which is the placeholder how we named the user document we found in DB based on inputted email and password
      // res.json(req.user);
      res.json({ userInfo });
    });
  })(req, res, next);
})

////////// LOGOUT ///////////
router.delete('/logout', (req, res, next) => {
  // "req.logOut()" IN BACKEND is a Passport method that removes the user ID from session
  req.logOut();
  // we have to send a response to the FRONTEND via JSON, send empty userInfo when you logout.
  res.json({ userInfo: null });
})

////////////// CHECKUSER //////////////
// Frontend asking Backend if there is a user in session to keep going
router.get('/checkuser', (req, res, next) => {
  // "req.user" comes from the SESSION package
  if(req.user){
    req.user.password = undefined;
    res.json({ userInfo: req.user })
  } else {
    res.json({ userInfo: null });
  }
})


module.exports = router;
