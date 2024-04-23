// Import route handlers
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import middleware
const { ensureAuth } = require('./middleware');

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');
const Tag = require('../models/tag');


// Admin Dashboard
router.get('/admin', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.render('admin/admin-dashboard.ejs', { user: req.user });
    } else {
      res.render('static/index.ejs', { user: null });
    }
  } catch (err) {
    throw err;
  }
});


// Export router
module.exports = router;
