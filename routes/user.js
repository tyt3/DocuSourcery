// Route handlers
const express = require("express");
const router = express.Router();


// Import data models


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
  
// Log Out


// ACCOUNT

// View Account

// Edit Account


// PROFILE

// View Profile

// Edit Profile


// DASHBOARD

// View Dashbard


// Export router
module.exports = router;
