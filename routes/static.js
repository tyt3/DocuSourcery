// Import route handlers
const express = require('express');
const router = express.Router();

// Import middleware
const middleware = require('./middleware');

// Import data models

// Index
router.get('/', async (req, res) => {
  try {
    res.render('static/index.ejs', {});
  } catch (err) {
    throw err;
  }
});


// About
router.get('/about', async (req, res) => {
  try {
    res.render('static/about.ejs', {});
  } catch (err) {
    throw err;
  }
});


// API Documentation
router.get('/api-documentation', async (req, res) => {
  try {
    res.render('static/api-documentation.ejs', {});
  } catch (err) {
    throw err;
  }
});


// Export router
module.exports = router;
