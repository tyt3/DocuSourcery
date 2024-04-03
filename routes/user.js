// Route handlers
const express = require("express");
const router = express.Router();


// AUTH

// Sign Up


// Log In
router.get('/login', async (req, res) => {
    try {
      res.render("user/login.ejs",{});
    } catch (err) {
      throw err;
    }
  });
  
  module.exports = router;
  
// Log Out


// ACCOUNT

// View Account

// Edit Account


// PROFILE

// View Profile

// Edit Profile


// DASHBOARD

// View Dashbard
