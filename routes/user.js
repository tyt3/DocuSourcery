// Route handlers
const express = require("express");
const router = express.Router();


// AUTH

// Sign Up


// Log In

// Show Log In page
router.get('/login', async (req, res) => {
    try {
      res.render("user/login.ejs",{message: "hello!"});
    } catch (err) {
      throw err;
    }
  });
  
module.exports = router;

// Handle Login
router.get('/login', async (req, res) => {
    try {
      // Get form data
      // Attempt to login using model and auth middleware
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
