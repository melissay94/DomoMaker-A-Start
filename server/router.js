// Set up route to controllers
const controllers = require('./controllers');

// Set up the route for the app in app.js
// Connect all our routes for the different necessary controllers
const router = (app) => {
  app.get('/', controllers.Account.loginPage);
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.login);
  app.get('/signup', controllers.Account.signupPage);
  app.post('/signup', controllers.Account.signup);
  app.get('/logout', controllers.Account.logout);
  app.get('/maker', controllers.Domo.makerPage);
};

// Export so we can use it in app.js
module.exports = router;
