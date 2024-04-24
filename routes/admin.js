// Import route handlers
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import middleware
const { ensureAuth, ensureAdmin, checkUsernameAndEmail, validatePassword } = require('./middleware');
const bcrypt = require('bcrypt');

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');
const Tag = require('../models/tag');


// Admin Dashboard
router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.render('admin/admin-dashboard.ejs', { user: req.user });
    } else {
      res.render('static/index.ejs', { user: null });
    }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// User Management
router.get('/users', async (req, res) => {
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
router.post('/user/add', ensureAuth, ensureAdmin, checkUsernameAndEmail, validatePassword, async (req, res) => {
  const { firstName, lastName, username, email, password, passwordConf, admin } = req.body;

  try {
       // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User document
    const user = new User({
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      admin: admin
    });

    const newUser = await user.save();

    // Redirect to admin page
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Internal server error while adding user.');
  }
});


// Edit User
router.post('/user/edit/:id', ensureAuth, ensureAdmin, checkUsernameAndEmail, async (req, res) => {
  const { firstName, lastName, username, email, password, passwordConf, admin } = req.body;
  const userId = req.params.id;
  
  try {
     // Fetch the existing user
     const usr = await User.findById(userId);
     if (!usr) {
       return res.status(404).send('User not found.');
     }

    // Hash the password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the usr fields
    usr.firstName = firstName || usr.firstName;
    usr.lastName = lastName || usr.lastName;
    usr.username = username || usr.username;
    usr.email = email || usr.email;
    usr.password = hashedPassword || usr.password;
    usr.admin = admin !== undefined ? admin : usr.admin;

    // Save the updated usr
    await usr.save();

    // Redirect or log the user in directly
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Internal server error while adding user.');
  }
});


// Delete User
router.delete('/user/delete/:id', ensureAuth, ensureAdmin, async (req, res) => {
  const usrId = req.params.id;

  try {
    // Get user
    const usr = await User.findById(usrId);
    if (!usr) {
      return res.status(404).send('User not found.');
    }
    
    // Perform a permanent delete
    await User.deleteOne({ _id: usrId });

    return res.send({ message: 'User permanently deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal server error while deleting user.');
  }
});


// Export router
module.exports = router;
