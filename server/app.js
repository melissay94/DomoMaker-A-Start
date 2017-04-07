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
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');

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

// Set up username and password for connecting to Redis
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPass;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPass = redisURL.auth.split(';')[1];
}

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
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPass,
  }),
  secret: 'Domo Komodo',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') { return next(err); }

  console.log('Missing CSRF token');
  return false;
});

// Set up handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// Disable header so users can't see what our server is running
app.disable('x-powered-by');

// Use the route for the app
router(app);

// Set up the app to listen for the port type
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
