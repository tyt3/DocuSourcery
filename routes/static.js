// Import route handlers
const express = require('express');
const router = express.Router();

// Import middleware
const middleware = require('./middleware');

// Import data models

// Index
router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.render('static/index.ejs', { user: req.user });
    } else {
      res.render('static/index.ejs', { user: null });
    }
  } catch (err) {
    throw err;
  }
});



// About
router.get('/about', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.render('static/about.ejs', { user: req.user });
    } else {
      res.render('static/about.ejs', { user: null });
    }
  } catch (err) {
    throw err;
  }
});


// API Documentation
router.get('/api-documentation', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.render('static/api-documentation.ejs', { user: req.user });
    } else {
      res.render('static/api-documentation.ejs', { user: null });
    }
  } catch (err) {
    throw err;
  }
});



// Export router
module.exports = router;
