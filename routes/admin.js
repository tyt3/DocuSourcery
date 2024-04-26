// Import route handlers
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('./passportConfig');


// Import middleware
const { ensureAuthAdmin, ensureNotAuth, ensureAdmin, checkUsernameAndEmail, validatePassword } = require('./middleware');
const bcrypt = require('bcrypt');

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');
const Tag = require('../models/tag');


// Functions
// Generate API keys (Credit: ChatGPT)
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}

function generateApiKey(minLength, maxLength) {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  return generateRandomString(length);
}


// Log In
router.get('/login', ensureNotAuth, async (req, res) => {
  try {
    const useEmail = req.query.email === 'true';
    res.render('user/login.ejs', { useEmail: useEmail, user: null });
  } catch (err) {
    throw err;
  }
});

router.post('/login', ensureNotAuth, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication Error: ', err);
      return next(err);
    }
    if (!user) {
      console.log('Login Failed: ', info);
      return res.redirect('/admin/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login Error: ', err);
        return next(err);
      }
      // Redirect the user back to the original requested URL or /dashboard if no returnTo URL is set
      return res.redirect('/admin');
    });
  })(req, res, next);
});

// Admin Dashboard
router.get('/', ensureAuthAdmin, ensureAdmin, async (req, res) => {
  try {
    res.render('admin/admin-dashboard.ejs', { user: req.user });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// User Management
router.get('/users', ensureAuthAdmin, ensureAdmin, async (req, res) => {
  try {
      // Fetch all users from the database
      const users = await User.find();

      // Render view
      res.render('admin/users', { user: req.user, users: users });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// Add User
router.post('/user/add', ensureAuthAdmin, ensureAdmin, checkUsernameAndEmail, validatePassword, async (req, res) => {
  const { firstName, lastName, username, email, password, passwordConf, admin } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get admin status
    let adminStatus = false;
    let apiKey;
    if (admin === "on") {
      adminStatus = true;
      apiKey = generateApiKey(20, 128);
    }

    // Create the User document
    const user = new User({
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      admin: adminStatus,
      apiKey: apiKey
    });

    const newUser = await user.save();

    // Redirect to user management dashboard
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Internal server error while adding user.');
  }
});


// Edit User
router.post('/user/edit/:id', ensureAuthAdmin, ensureAdmin, async (req, res) => {
  const { firstName, lastName, username, email, password, passwordConf, admin } = req.body;
  const userId = req.params.id;
  
    console.log("admin:" + admin);
  
  try {
     // Fetch the existing user
     const usr = await User.findById(userId);
     if (!usr) {
       return res.status(404).send('User not found.');
     }

    // TODO: Validate username and password

    // Hash the password
    let hashedPassword = null;
    if (password) {
       hashedPassword = await bcrypt.hash(password, 10);
    } 

    // Get admin status
    let adminStatus = false;
    if (admin === "on") {
      adminStatus = true;
      usr.apiKey = generateApiKey(20, 128);
    }
    

    // Update the usr fields
    usr.firstName = firstName || usr.firstName;
    usr.lastName = lastName || usr.lastName;
    usr.username = username || usr.username;
    usr.email = email || usr.email;
    usr.password = hashedPassword !== null ? hashedPassword : usr.password;
    usr.admin = adminStatus;

    // Save the updated usr
    await usr.save();

    // Redirect to user management dashboard
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Internal server error while adding user.');
  }
});


// Delete User
router.post('/user/delete/:id', ensureAuthAdmin, ensureAdmin, async (req, res) => {
  const usrId = req.params.id;

  try {
    // Get user
    const usr = await User.findById(usrId);
    if (!usr) {
      return res.status(404).send('User not found.');
    }
    
    // Perform a permanent delete
    await User.deleteOne({ _id: usrId });

    // Redirect to user management dashboard
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal server error while deleting user.');
  }
});


// Export router
module.exports = router;
