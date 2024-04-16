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
router.get('/test/project/create', ensureAuth, async (req, res) => {
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


// Edit Project View
router.get('/test/project/:projectSlug/edit/', ensureAuth, async (req, res) => {
  const projectSlug = req.params.projectSlug;

  // TODO: Get project to send to frontend
  // TODO: Populate all documents and pages in project
  // TODO: Convert description field HTML to Markdown with turndown.js

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


// View Project
router.get('/test/project/:slug', async (req, res) => {
  const projectSlug = req.params.slug;

  // TODO: Get project to send to frontend
  // TODO: Populate all documents and pages in project

  try {
    const project = await Project.findOne({ slug: projectSlug });
    res.render('project/project.ejs', { 
      user: req.user,
      project: project,
      document: null,
      page: null,
      viewType: "project"
    });
  } catch (err) {
    throw err;
  }
});

// View Published Projects
router.get('/test/projects', async (req, res) => {
  // TODO: Get all projects where public===true

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
router.get('/test/project/:projectSlug/document/create', ensureAuth, async (req, res) => {
  const projectId = req.params.projectSlug;

  // TODO: Get project to send to frontend

  try {
    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: null 
    });
  } catch (err) {
    throw err;
  }
});


// Edit Document View
router.get('test/project/:projectSlug/:documentSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    // TODO: Get project and document objects and send to frontend
    // TODO: Populate all pages in document
    // TODO: Convert description field HTML to Markdown with turndown.js

    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: null,
      document: null
    });
  } catch (err) {
    throw err;
  }
});

// View Document
router.get('/test/project/:projectSlug/:documentSlug/', async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    // TODO: Get project and document objects and send to frontend
    // TODO: Populate all pages in document
    
    var viewType;
    var page = null;

    // Determine if the document or its first page should be rendered
    if (document.landingPage || document.pages.length === 0) {
        viewType = "document";
    } else {
        viewType = "page";
        page = document.pages.find(page => page.order === 0);
    }

    res.render('project/project.ejs', { 
      user: req.user,
      project: null, // TODO: Replace with project
      document: null, // TODO: Replace with document
      page: page,
      viewType: viewType
    });
  } catch (err) {
    throw err;
  }
});

// PAGE

// Create Page View
router.get('/test/project/:projectSlug/:documentSlug/page/create', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  
  // TODO: Get project and document, error if not found 

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


// Edit Page View
router.get('/test/project/:projectSlug/:documentSlug/:pageSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Get project, document, and page objects and send to frontend
    // TODO: Convert description field HTML to Markdown with turndown.js

    res.render('project/pageEdit.ejs', { 
      user: req.user,
      project: null, // TODO: Replace with project
      document: null, // TODO: Replace with document
      page: null, // TODO: Replace with page
    });
  } catch (err) {
    throw err;
  }
});


// View Page
router.get('/test/project/:projectSlug/:documentSlug/:pageSlug', async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Get project, document, and page objects and send to frontend

    res.render('project/project.ejs', { 
      user: req.user,
      project: null, // TODO: Replace with project
      document: null, // TODO: Replace with document
      page: null, // TODO: Replace with page
      viewType: "page"
    });
  } catch (err) {
    throw err;
  }
});


// TRASH

// View User Trash
router.get('/test/trash', ensureAuth, async (req, res) => {
  try {
    // TODO: Get all user projects where role=3 and deleted=true
    res.render('project/trash.ejs', { 
      user: req.user,
      projects: [] 
    });
  } catch (err) {
    throw err;
  }
});


// Export router
module.exports = router;
