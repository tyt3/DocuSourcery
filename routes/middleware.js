// middleware.js

// Check if the user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, continue to the next middleware or route handler
  } else {
    // User is not authenticated, redirect to login page with flash message
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/login');
  }
};

// Check if the user is already authenticated
function ensureNotAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(); // User is not authenticated, continue to the next middleware or route handler
  } else {
    // User is already authenticated, redirect to dashboard with flash message
    req.flash('error', 'You are already logged in.');
    res.redirect('/dashboard');
  }
};

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
  populateCurrentUser: populateCurrentUser,
};
