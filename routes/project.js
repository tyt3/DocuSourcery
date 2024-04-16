// Route handlers
const express = require('express');
const router = express.Router();

// Import middleware
const { ensureAuth } = require('./middleware');

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');


// PROJECT

// Create Project View
router.get('/project/create', ensureAuth, async (req, res) => {
  try {
    res.render('project/projectEdit.ejs', { 
      user: req.user, 
      users: [req.user],
      project: null 
    });
  } catch (err) {
    throw err;
  }
});

// Create Project
router.post('/project/create', ensureAuth, async (req, res) => {
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
router.get('/project/:projectSlug/edit/', ensureAuth, async (req, res) => {
  const projectSlug = req.params.projectSlug;
  try {
    const project = await Project.findOne({ slug: projectSlug });
    res.render('project/projectEdit.ejs', { 
      user: req.user, 
      users: [],
      project: project
    });
  } catch (err) {
    throw err;
  }
});

// Edit Project
router.put('/project/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Delete Project
router.delete('/project/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Restore Project
router.put('/project/restore/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// View Project
router.get('/project/:slug', async (req, res) => {
  const projectSlug = req.params.slug;
  try {
    const project = await Project.findOne({ slug: projectSlug });
    res.render('project/project.ejs', { 
      user: req.user,
      project: project,
      type: "project"
    });
  } catch (err) {
    throw err;
  }
});

// View Published Projects
router.get('/projects', ensureAuth, async (req, res) => {
  try {
    res.render('project/projects.ejs', { 
      user: req.user,
      project: null 
    });
  } catch (err) {
    throw err;
  }
});


// DOCUMENT

// Create Document View
router.get('project/:projectSlug/document/create', ensureAuth, async (req, res) => {
  const projectId = req.params.projectSlug;
  try {
    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: null 
    });
  } catch (err) {
    throw err;
  }
});

// Create Document
router.post('/document/create/:projectId', ensureAuth, async (req, res) => {
  const projectId = req.params.projectId;
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
router.get('project/:projectSlug/:documentSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    // TODO: Get project and document objects and send to frontend
    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: null,
      document: null
    });
  } catch (err) {
    throw err;
  }
});

// Edit Document
router.put('/document/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Delete Document
router.delete('/document/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Restore Document
router.put('/document/restore/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// View Document
router.get('/project/:projectSlug/:documentSlug/', async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    // TODO: Get project and document objects and send to frontend
    
    res.render('project/project.ejs', { 
      user: req.user,
      project: null,
      document: document,
      type: document.landingPage ? "document" : "page";

    });
  } catch (err) {
    throw err;
  }
});

// PAGE

// Create Page View
router.get('project/:projectSlug/:documentSlug/page/create', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    res.render('project/pageEdit.ejs', { 
      user: req.user,
      project: null,
      document: null,
      page: null
    });
  } catch (err) {
    throw err;
  }
});

// Create Page
router.post('/page/create/:projectId/:docId', ensureAuth, async (req, res) => {
  const { projectId, docId } = req.params;
  const { title } = req.body;

  // Validate form fields
  // Title length is less than or equal to 255

  try {
    // Assuming you have a Page schema with projectId and docId as references
    const page = new Page({
      title: title,
      projectId: projectId,
      docId: docId
      // Add remaining fields as needed
    });

    const newPage = await page.save();
    res.status(201).json(newPage); // Return the created page as JSON

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Edit Page View
router.get('project/:projectSlug/:documentSlug/:pageSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Get project, document, and page objects and send to frontend
    res.render('project/pageEdit.ejs', { 
      user: req.user,
      project: null,
      document: null, 
      page: null
    });
  } catch (err) {
    throw err;
  }
});

// Edit Page
router.put('/page/:id', ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Delete Page
router.delete('/page/:id', ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// Restore Page
router.put('/page/restore/:id', ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});


// View Page
router.get('project/:projectSlug/:documentSlug/:pageSlug', async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Get project, document, and page objects and send to frontend
    res.render('project/project.ejs', { 
      user: req.user,
      project: null,
      document: null,
      page: null,
      type: "page"
    });
  } catch (err) {
    throw err;
  }
});


// TRASH

// View User Trash
router.get('/trash', ensureAuth, async (req, res) => {
  try {
    // TODO: Get user projects where role=3 and deleted=true
    res.render('project/trash.ejs', { 
      user: req.user,
      projects: [] 
    });
  } catch (err) {
    throw err;
  }
});

// Empty User Trash
router.delete('/trash', ensureAuth, async (req, res) => {
  try {
    // TODO: Delete all of user's projects where role=3 and deleted=true
  } catch (err) {
    throw err;
  }
});

// Empty Project Trash
router.delete('/project/trash/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Delete all project documents and pages where role=3 and deleted=true
  } catch (err) {
    throw err;
  }
});

// Export router
module.exports = router;
