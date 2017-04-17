// Checks if an account was attached to the session
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Checks if the user already logged in
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }
  return next();
};

// Checks if forwarded header is secure
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// Bypass the check for local environmnet
const bypassSecure = (req, res, next) => {
  next();
};

// Export functions
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Export based on environment type
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
