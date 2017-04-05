// import all the libraries, so many of the libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');

// Pull in the routes
const router = require('./router.js');

// set up port as always, don't forget to capitilize it
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Set up database url with mongo
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// Use mongo to print out an error if it occurs
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});


// Set up the app using express
const app = express();

// Set up all the paths, resources, and libraries the app will need
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  secret: 'Domo Komodo',
  resave: true,
  saveUninitialized: true,
}));
// Set up handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// Use the route for the app
router(app);

// Set up the app to listen for the port type
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
