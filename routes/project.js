// Route handlers
const express = require('express');
const router = express.Router();

// Import middleware
const middleware = require('./middleware');

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');

// PROJECT

// View Project
router.get('/project/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    res.render('project/projectEdit.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Create Project View
router.get('/project/create', middleware.ensureAuth, async (req, res) => {
  try {
    console.log("TEST: Rendering projectEdit.ejs");
    res.render('project/projectEdit.ejs', { user: req.user, users: [req.user] });
  } catch (err) {
    throw err;
  }
});

// Create Project
router.post('/project/create', middleware.ensureAuth, async (req, res) => {
  const { title } = req.body; // TODO: Add remaining fields

  // Validate form fields
  // Title length is less than or equal to 255

  try {
    const project = new Project({
      title: title,
    });

    const newProject = await project.save();
    await newProject.save();

  } catch (err) {
    throw err;
  }
});

// Edit Project View
router.get('/project/edit/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Get project object and send to frontend
    // Add data to send to frontend
    const data = {
      mode: 'edit',
    }
    res.render('project/projectEdit.ejs', { user: req.user, users: [] });
  } catch (err) {
    throw err;
  }
});

// Edit Project
router.put('/project/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Delete Project
router.delete('/project/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Restore Project
router.put('/project/restore/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// View Published Projects
router.get('/projects', middleware.ensureAuth, async (req, res) => {
  try {
    res.render('project/projects.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});


// DOCUMENT

// View Document
router.get('/document/:id', middleware.ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    res.render('project/documentEdit.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Create Document View
router.get('/document/create', middleware.ensureAuth, async (req, res) => {
  try {
    // Add data to send to frontend
    const data = {
      mode: 'create',
    }
    res.render('project/documentEdit.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Create Document
router.post('/document/create/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  const { title } = req.body; // TODO: Add remaining fields

  // Validate form fields
  // Title length is less than or equal to 255

  try {
    const document = new Document({
      title: title,
    });

    const newDocument = await document.save();
    await newDocument.save();

  } catch (err) {
    throw err;
  }
});

// Edit Document View
router.get('/document/edit/:id', middleware.ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Get document object and send to frontend
    // Add data to send to frontend
    const data = {
      mode: 'edit',
    }
    res.render('project/documentEdit.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Edit Document
router.put('/document/:id', middleware.ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Delete Document
router.delete('/document/:id', middleware.ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Restore Document
router.put('/document/restore/:id', middleware.ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});


// PAGE

// View Page
router.get('/page/:id', middleware.ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    res.render('project/page.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Create Page View
router.get('/page/create', middleware.ensureAuth, async (req, res) => {
  try {
    // Add data to send to frontend
    const data = {
      mode: 'create',
    }
    res.render('project/pageEdit.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Create Page
router.post('/page/create/:id', middleware.ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  const { title } = req.body; // TODO: Add remaining fields

  // Validate form fields
  // Title length is less than or equal to 255

  try {
    const page = new Page({
      title: title,
    });

    const newPage = await page.save();
    await newPage.save();

  } catch (err) {
    throw err;
  }
});

// Edit Page View
router.get('/page/edit/:id', middleware.ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Get page object and send to frontend
    // Add data to send to frontend
    const data = {
      mode: 'edit',
    }
    res.render('project/pageEdit.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Edit Page
router.put('/page/:id', middleware.ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Delete Page
router.delete('/page/:id', middleware.ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Restore Page
router.put('/page/restore/:id', middleware.ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});


// TRASH

// View User Trash
router.get('/trash', middleware.ensureAuth, async (req, res) => {
  try {
    res.render('project/trash.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Empty User Trash
router.delete('/trash', middleware.ensureAuth, async (req, res) => {
  try {
    // TODO: Delete all of user's projects where role=3 and deleted=true
  } catch (err) {
    throw err;
  }
});

// Empty Project Trash
router.delete('/project/trash/:id', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Delete all project documents and pages where role=3 and deleted=true
  } catch (err) {
    throw err;
  }
});

// Export router
module.exports = router;
