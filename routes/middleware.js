// middleware.js

// Import data models
const User = require('../models/user');

// Check if the user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    // User is not authenticated, redirect to login page with flash message
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/login');
  }
};


// Check if the user is already authenticated
function ensureNotAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    // User is already authenticated, redirect to dashboard with flash message
    req.flash('error', 'You are already logged in.');
    res.redirect('/dashboard');
  }
};

// Ensure that given username and email are unique
// Ensure that given username and email are unique
const checkUsernameAndEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    // Check if any other user has the same username
    const duplicateUsername = await User.findOne({ username: username });
    if (duplicateUsername) {
      return res.status(400).json({ error: 'Username is already in use by another user.' });
    }

    // Check if any other user has the same email
    const duplicateEmail = await User.findOne({ email: email });
    if (duplicateEmail) {
      return res.status(400).json({ error: 'Email is already in use by another user.' });
    }

    next(); // Move to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


// Validate Password
function validatePassword(req, res, next) {
  const { password, password_conf } = req.body;
  let valid = true;
  const errors = [];

  // Check for valid password
  if (password.length < 8) {
    valid = false;
    errors.push("Password must be at least 8 characters.");
  }
  if (password.length > 20) {
    valid = false;
    errors.push("Password must be less than or equal to 20 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    valid = false;
    errors.push("Password must contain at least 1 uppercase letter.");
  }
  if (!/\d/.test(password)) {
    valid = false;
    errors.push("Password must contain at least 1 number.");
  }
  if (!/[_@()*&^%#<>,$!]/.test(password)) {
    valid = false;
    errors.push("Password must contain at least 1 special character.");
  }
  if (password !== password_conf) {
    valid = false;
    errors.push("Passwords do not match.");
  }

  // If not valid, send error messages
  if (!valid) {
    return res.status(400).json({ errors });
  }

  next(); // Move to the next middleware
}


// Populate fields with authenticated user ID
function populateCurrentUser(req, res, next) {
  if (req.isAuthenticated()) {
    const userId = req.user._id;
    if (!this.createdBy) {
      this.createdBy = userId;
    }
    if (!this.updatedBy) {
      this.updatedBy = userId;
    }
    if (!this.deletedBy && this.deleted) {
      this.deletedBy = userId;
    }
  }
  next();
};


// Export the middleware functions
module.exports = {
  ensureAuth: ensureAuth,
  ensureNotAuth: ensureNotAuth,
  validatePassword: validatePassword,
  checkUsernameAndEmail: checkUsernameAndEmail,
  populateCurrentUser: populateCurrentUser
};
