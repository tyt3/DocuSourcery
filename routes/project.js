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
const Tag = require('../models/tag');


// PROJECT

// Create Project View
router.get('/project/create', ensureAuth, async (req, res) => {
  try {
    res.render('project/projectEdit.ejs', { 
      user: req.user, 
      users: [req.user],
      project: null,
      document: null, // Don't replace
      page: null // Don't replace
    });
  } catch (err) {
    throw err;
  }
});

// Create Project
router.post('/project/create', ensureAuth, async (req, res) => {
  const { title, subtitle, slug, description, tags, noLogin, canDuplicate, isPublic } = req.body;

  // TODO: Write and apply middleware to validate form fields
    // Title length is less than or equal to 255 characters 
    // Subtitle length is less than or equal to 255 characters 
    // Slug is unique
    // Slug length is less than 25 characters
    // Slug contains only letters, numbers, and dashes
  // TODO: Convert description field Markdown to HTML with markdown.js
  // TODO: Check whether tags exist, if not create them (comma separated list in text box?) and add to project record
  let linkedTags = [];
  try {
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim());

      for (const tagTitle of tagsArray) {
        let tag = await Tag.findOne({ title: tagTitle });

        if (!tag) {
          // Create a new tag if it doesn't exist
          tag = new Tag({
            title: tagTitle,
            slug: tagTitle.replace(/\s+/g, '-').toLowerCase(), // Replace whitespace with hyphens
            createdBy: req.user._id
          });
          await tag.save();
        }
        linkedTags.push({
          title: tag.title,
          slug: tag.slug,
          id: tag._id // ObjectId of the tag record
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during tag handling: ${err}`);
  }

  try {
    let publicChoice = false;
    if (isPublic === "on") {
      publicChoice = true;
    }

    const project = new Project({
      slug: slug,
      title: title,
      subtitle: subtitle,
      description: description,
      createdBy: req.user._id,
      public: publicChoice,
      tags: linkedTags,
      permissions: {noLogin: noLogin, duplicatable: canDuplicate},
      users: [
        {
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: 3,
          username: req.user.username
        }
      ]
    });

    const newProject = await project.save();

    // Render the new project
    res.render('project/projectEdit.ejs', { 
      user: req.user, 
      users: [],
      project: newProject,
      document: null, // Don't replace
      page: null // Don't replace
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during project creation: ${err}`);
  }
});

// Edit Project View
router.get('/project/:projectSlug/edit/', ensureAuth, async (req, res) => {
  const projectSlug = req.params.projectSlug;

  // TODO: Get project to send to frontend
  // TODO: Populate all documents and pages in project
  // TODO: Convert description field HTML to Markdown with turndown.js

  try {
    const project = await Project.findOne({ slug: projectSlug });
    res.render('project/projectEdit.ejs', { 
      user: req.user, 
      users: [],
      project: project,
      document: null, // Don't replace
      page: null // Don't replace
    });
  } catch (err) {
    throw err;
  }
});

// Edit Project
router.put('/project/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;

  // TODO: Apply same middleware as in project/create to validate form fields
  // TODO: Convert description field Markdown to HTML with markdown.js

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

  // TODO: Get project to send to frontend
  // TODO: Populate all documents and pages in project

  try {
    const project = await Project.findOne({ slug: projectSlug });
    if ((project.permissions.loginRequired && req.user) || !project.permissions.loginRequired) {
      res.render('project/project.ejs', { 
        user: req.user,
        project: project,
        document: null, // Don't replace
        page: null, // Don't replace
        viewType: "project"
      });
    }
    else {
      req.session.returnTo = req.url;
      res.redirect('/login');
    }
  } catch (err) {
    throw err;
  }
});

// View Published Projects
router.get('/projects', async (req, res) => {
  await Project.find({public: true})
    .then((project_list) => {
      res.render('project/projects.ejs', {
        user: req.user,
        project: project_list
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


// DOCUMENT

// Create Document View
router.get('/project/:projectSlug/document/create', ensureAuth, async (req, res) => {
  const projectSlug = req.params.projectSlug;

  // TODO: add error handling
  const project = await Project.findOne({ slug: projectSlug });

  try {
    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: project,
      document: null, // Don't replace
      page: null // Don't replace
    });
  } catch (err) {
    throw err;
  }
});

// Create Document
router.post('/document/create/:projectId', ensureAuth, async (req, res) => {
  const projectId = req.params.projectId;
  const { title } = req.body; // TODO: Add remaining fields

  // TODO: Apply middleware to validate form fields
  // TODO: Convert description field Markdown to HTML with markdown.js

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
router.get('/project/:projectSlug/:documentSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    // TODO: Get project and document objects and send to frontend
    // TODO: Confirm that document is in project
    // TODO: Convert description field HTML to Markdown with turndown.js

    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: null, // TODO: Replace
      document: null, // TODO: Replace
      page: null, // Don't replace 
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
    // TODO: Confirm that document is in project
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
router.get('/project/:projectSlug/:documentSlug/page/create', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  
  // TODO: Get project and document, error if not found 

  try {
    const project = await Project.findOne({ slug: projectSlug });
    const document = await Document.findOne({ slug: documentSlug });

    // TODO: Confirm that document is in project

    res.render('project/pageEdit.ejs', { 
      user: req.user,
      project: project,
      document: project,
      page: null // Don't replace
    });
  } catch (err) {
    throw err;
  }
});

// Create Page
router.post('/page/create/:projectId/:docId', ensureAuth, async (req, res) => {
  const { projectId, docId } = req.params;
  const { title } = req.body;

  // TODO: Get project and document, error if not found
  // TODO: Validate form fields
  // TODO: Convert description field Markdown to HTML with markdown.js

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
router.get('/project/:projectSlug/:documentSlug/:pageSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Get project, document, and page objects and send to frontend
    // TODO: Confirm that document is in project and page is in document
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
router.get('/project/:projectSlug/:documentSlug/:pageSlug', async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Get project, document, and page objects and send to frontend
    // TODO: Confirm that document is in project and page is in document

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


// TAGS
router.get('/tag/:slug', async (req, res) => {
  const tagSlug = req.params.slug;
  try {
    const tag = await Tag.findOne({ slug: tagSlug });
    res.render('project/tag.ejs', { 
      user: req.user,
      tag: tag
    });
  } catch (err) {
    throw err;
  }
});


// TRASH

// View User Trash
router.get('/trash', ensureAuth, async (req, res) => {
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
    // TODO: Get and populate project
    // TODO: Delete all project documents and pages where role=3 and deleted=true
  } catch (err) {
    throw err;
  }
});

// Export router
module.exports = router;
