// middleware.js

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');
const Tag = require('../models/tag');


// Check if the user is authenticated\
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // Store the original requested URL in the session
    req.session.returnTo = req.url;
    console.log(req.session.returnTo);
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

// Check if the user is authenticated\
function ensureAdmin(req, res, next) {
  if (req.user.admin) {
    return next();
  } else {
    // Store the original requested URL in the session
    req.status(401).json({ error: 'You must be a system administrator to access this page.' });
  }
};

// Validate API key before allowing API request
const checkApiKey = async (req, res, next) => {
  // Extract API key from request header
  const apiKey = req.headers['api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    // Query the database to find a user with the provided API key
    const authUser = await User.findOne({ apiKey: apiKey });

    if (!authUser) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Attach the user object to the request for later use
    req.user = authUser;
    next();
  } catch (error) {
    console.error('Error while validating API key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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


const checkAuthUsernameAndEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;
    
    // Check if any other user has the same username
    const duplicateUsername = await User.findOne({ username: username, _id: { $ne: userId } });
    if (duplicateUsername) {
      req.flash('error', 'Username is already in use by another user.');
      return res.redirect('back'); // Redirect back to the form page
    }

    // Check if any other user has the same email
    const duplicateEmail = await User.findOne({ email: email, _id: { $ne: userId } });
    if (duplicateEmail) {
      req.flash('error', 'Email is already in use by another user.');
      return res.redirect('back'); // Redirect back to the form page
    }

    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred. Please try again.');
    return res.redirect('back'); // Redirect back to the form page
  }
};


// Validate Password
function validatePassword(req, res, next) {
  const { password, passwordConf } = req.body;
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
  if (password !== passwordConf) {
    valid = false;
    errors.push(`Passwords do not match: ${password} != ${passwordConf}`);
  }

  // If not valid, send error messages
  if (!valid) {
    return res.status(400).json({ errors });
  }

  next(); // Move to the next middleware
}


// Validate Slug
const validateSlug = async (req, res, next) => {
  try {
    const { slug } = req.body;
    let valid = true;
    const errors = [];

    // Check if any other record uses the same slug, but only if creating something new
    if (req.originalUrl.includes('/create')) {
      var duplicateSlug;
      if (req.originalUrl.includes('/project')) {
        duplicateSlug = await Project.findOne({ slug: slug });
      }
      else if (req.originalUrl.includes('/document')) {
        duplicateSlug = await Document.findOne({ slug: slug });
      }
      else if (req.originalUrl.includes('/page')) {
        duplicateSlug = await Page.findOne({ slug: slug });
      }
      else if (req.originalUrl.includes('/tag')) {
        duplicateSlug = await Tag.findOne({ slug: slug });
      }
      else {
        valid = false;
        errors.push("Invalid object model.")
      }

      if (duplicateSlug) {
        valid = false;
        errors.push("Slug must be unique.");
      }
    }
    // Check for valid slug lengths
    if (!slug) {
      if (req.originalUrl.includes('/create')) {
        valid = false;
        errors.push("Slug is required.");
      } else {
        next();
      }
    }
    if (slug.length < 1) {
      valid = false;
      errors.push("Slug must be at least one character.");
    }
    if (slug.length > 25) {
      valid = false;
      errors.push("Slug must be less than or equal to 25 characters.");
    }
    // Use regex to check if slug contains unaccepted character types
    if (!/^[a-zA-Z0-9\-]+$/.test(slug)) {
      valid = false;
      errors.push("Slug must only contain letters, numbers, and dashes.");
    }

    // If not valid, send error messages
    if (!valid) {
      return res.status(400).json({ errors });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json(`Error occurred during slug validation: ${err}`);
  }

  next(); // Move to the next middleware
}


// Validate Title and Subtitle
function validateTitles(req, res, next) {
  const { title, subtitle } = req.body;
  let valid = true;
  const errors = [];

  // Check for valid title/subtitle lengths
  try {
    if (title.length < 1) {
      valid = false;
      errors.push("Title must be at least one character.");
    }
    if (title.length > 255) {
      valid = false;
      errors.push("Title must be less than or equal to 255 characters.");
    }
    if (req.originalUrl.includes('/project/create')) {
      // Subtitle not mandatory, but if it is present, should be <= 255 characters
      if (subtitle) {
        if (subtitle.length > 255) {
          valid = false;
          errors.push("Subtitle must be less than or equal to 255 characters.");
        }
      }
    }
  } catch (err) {
    if (!(req.originalUrl.includes('/create'))) {
      next();
    } else {
      return res.status(500).json({ err });
    }
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
  ensureAdmin: ensureAdmin,
  validatePassword: validatePassword,
  checkApiKey: checkApiKey,
  checkUsernameAndEmail: checkUsernameAndEmail,
  checkAuthUsernameAndEmail: checkAuthUsernameAndEmail,
  populateCurrentUser: populateCurrentUser,
  validateTitles: validateTitles,
  validateSlug: validateSlug
};
