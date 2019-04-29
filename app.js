require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


const session = require('express-session');

const passportSetup = require('./config/passport/passport-setup');

// require CORS
const cors = require('cors');

mongoose
  // .connect('mongodb://localhost/craigslist-backend', {useNewUrlParser: true})
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// allow CORS (Cross Origin Resource Sharing)
app.use(cors({

  // allows other origins/domains to send cookies
  credentials: true,
  // the array of domains/origins we want to allow cookies from (in our case that is our React app, which runs on port 3000)
  origin: [ 'http://localhost:3000'  ]

}));


// handle session here:
// app.js
app.use(session({
  // secret: "some super secret goes here",
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// 🎯🎯🎯 MUST come after the session: 🎯🎯🎯
passportSetup(app);

const index = require('./routes/index');
app.use('/', index);
// link whole file to app by requiring auth-routes file. 
// app.js can use ALL auth-routes file by requiring it in the app.use.
// '/api' can be any name, just to differentiate it between frontend/backend
app.use('/api', require('./routes/auth-routes'));

app.use('/api', require('./routes/file-upload-routes'));

app.use('/api', require('./routes/house-post-routes'));

app.use('/api', require('./routes/car-post-routes'));

app.use('/api', require('./routes/allListings-routes'));

module.exports = app;
