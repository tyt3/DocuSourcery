// Route handlers
const express = require('express');
const router = express.Router()


// Import data models

// Index
router.get('/', async (req,res) => {
    try {
      res.render("/static/index.ejs",{ });
    } catch (err) {
      throw err;
    }
  });


// About
router.get('/about', async (req,res) => {
    try {
      res.render("/static/about.ejs",{ });
    } catch (err) {
      throw err;
    }
  });


module.exports = router;