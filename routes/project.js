// Route handlers
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import middleware
const { ensureAuth, validateTitles, validateSlug } = require('./middleware');

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
router.post('/project/create', ensureAuth, validateTitles, validateSlug, async (req, res) => {
  const { title, subtitle, slug, description, tags, noLogin, canDuplicate, isPublic } = req.body;

  // TODO: Convert description field Markdown to HTML with markdown.js
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
  // TODO: Populate all users
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

    // TODO: Implement 
    // Apply same middleware as in project/create to validate form fields
    // Convert description field Markdown to HTML with markdown.js
    // Get form fields from request
    // Validate input, flash error message and reload if any errors
    // Update object with new data

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
    // Must be authenticated
    // Redirect to Dashboard
    // If project.deleted=false:
    // - set to deleted=true
    // - set deletedDate=now
    // - set deletedBy=authenticatedUserID
    // if project.deleted=true: 
    // - delete object
  } catch (err) {
    throw err;
  }
});

// Restore Project
router.put('/project/restore/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    // TODO: Implement
    // Get project by ID
    // Set deleted to false
  } catch (err) {
    throw err;
  }
});


// View Project
router.get('/project/:slug', async (req, res) => {
  const projectSlug = req.params.slug;

  // TODO: Get project to send to frontend
  // TODO: Populate all documents and pages in project
  // TODO: Increment project views

  try {
    // Find the project by its slug and populate its 'documents' field
    const project = await Project.findOne({ slug: projectSlug }).populate('documents');

    // Check if project is found
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Check if documents are populated
    if (!project.documents || !Array.isArray(project.documents)) {
      return res.status(404).send('Documents not found for the project');
    }

    const documents = [];
    for (const doc of project.documents) {
      try {
        const docId = doc.get('_id');
        if (docId) {
          const document = await Document.findById(docId);
          if (document) {
            documents.push(document);
          } else {
            console.error(`Document not found for ID: ${docId}`);
          }
        } else {
          console.error('Document _id is undefined');
        }
      } catch (error) {
        console.error(`Error fetching document: ${error}`);
      }
    }

    if ((project.permissions.loginRequired && req.user) || !project.permissions.loginRequired) {
      res.render('project/project.ejs', { 
        user: req.user,
        project: project,
        documents: documents,
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
  try {
    // Retrieve all projects where public === true and sort by views in descending order
    const projects = await Project.find({ public: true }).sort({ views: -1 });

    // Render the projects template with sorted projects
    res.render('project/projects.ejs', {
      user: req.user,
      projects: projects
    });
  } catch (err) {
    // Handle errors
    console.error('Error:', err);
    res.status(500).send(err);
  }
});

// router.get('/projects', async (req, res) => {
//   await Project.find({public: true})
//     .then((projects) => {
//       res.render('project/projects.ejs', {
//         user: req.user,
//         projects: projects
//       });
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });

// Search Published Projects
router.get('/projects/:keywords', async (req, res) => {
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
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
  console.log('Received form data:', req.body); // This will show all data received from the form
  const { title, description, slug, landingPage } = req.body;
  const projectId = req.params.projectId;

  console.log('Received projectId:', projectId);
  console.log('Received data:', { title, description, slug, landingPage });

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    console.log('Invalid project ID:', projectId);
    return res.status(400).send('Invalid project ID.');
  }

  // Ensure required fields are present
  if (!title || !slug) {
    console.log('Validation error: Missing required fields.');
    return res.status(400).send('Missing required fields: title or slug.');
  }

  try {
    // Find the project to ensure it exists
    console.log('Looking up project:', projectId);
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('No project found with ID:', projectId);
      return res.status(404).send('Project not found.');
    }

    // Create a new document
    const newDocument = new Document({
      title,
      description,
      slug,
      createdBy: req.user._id,
      projectId,
      landingPage
    });

    console.log('Document prepared for saving:', newDocument);

    // Save the document
    await newDocument.save();
    console.log('Document saved successfully:', newDocument);

    // Update the project to include this new document
    project.documents.push({
      _id: newDocument._id,
      title: newDocument.title,
      slug: newDocument.slug
    });
    await project.save();
    console.log('Project updated with new document:', project);
    
    res.redirect(`/project/${project.slug}/${newDocument.slug}`);
    
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).send('Server error while creating document.');
  }
});

// Edit Document View
router.get('/project/:projectSlug/:documentSlug/edit', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  try {
    // TODO: Get project and document objects and send to frontend
    // TODO: Confirm that document is in project
    // TODO: Convert description field HTML to Markdown with turndown.j

    // TODO: add graceful error handling
    const project = await Project.findOne({ slug: projectSlug });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const document = await Document.findOne({
      slug: documentSlug,
      projectId: project._id
    })
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: project,
      document: document,
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
    // Apply same middleware as in project/create to validate form fields
    // Convert description field Markdown to HTML with markdown.js
    // Get form fields from request
    // Validate input, flash error message and reload if any errors
    // Update object with new data
  } catch (err) {
    throw err;
  }
});

// Delete Document
router.delete('/document/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
    // If document.deleted=false:
    // - set to deleted=true
    // - set deletedDate=now
    // - set deletedBy=authenticatedUserID
    // if document.deleted=true: 
    // - delete object
  } catch (err) {
    throw err;
  }
});

// Restore Document
router.put('/document/restore/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  try {
    // TODO: Implement
    // Get document by ID
    // Set deleted to false
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
    // TODO: Increment project views
    
    // Find the project by its slug
    const project = await Project.findOne({ slug: projectSlug });
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Find the document within this project using the document slug and ensure it belongs to the project
    const document = await Document.findOne({
      slug: documentSlug,
      projectId: project._id
    }).populate('pages'); // Assuming 'pages' is a field to populate

    if (!document) {
      return res.status(404).send('Document not found in the specified project');
    }

    var viewType;
    var page = null;

    // Determine if the document or its first page should be rendered
    if (document.landingPage || (document.pages && document.pages.length === 0)) {
      viewType = "document";
    } else {
      viewType = "page";
      page = document.pages.find(page => page.order === 0);
    }


    res.render('project/project.ejs', { 
      user: req.user,
      project: project, // TODO: Replace with project
      document: document, // TODO: Replace with document
      page: page,
      viewType: viewType
    });
  } catch (err) {
    console.error('Error retrieving document:', err);
    res.status(500).send('Internal server error');
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
    // Apply same middleware as in project/create to validate form fields
    // Convert body field Markdown to HTML with markdown.js
    // Get form fields from request
    // Validate input, flash error message and reload if any errors
    // Update object with new data
  } catch (err) {
    throw err;
  }
});

// Delete Page
router.delete('/page/:id', ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
    // If page.deleted=false:
    // - set to deleted=true
    // - set deletedDate=now
    // - set deletedBy=authenticatedUserID
    // if page.deleted=true: 
    // - delete object
  } catch (err) {
    throw err;
  }
});

// Restore Page
router.put('/page/restore/:id', ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    // TODO: Implement
    // Get page by ID
    // Set deleted to false
  } catch (err) {
    throw err;
  }
});

// View Page
router.get('/project/:projectSlug/:documentSlug/:pageSlug', async (req, res) => {
  const { projectSlug, documentSlug, pageSlug } = req.params;
  try {
    // TODO: Implement
    // Get project, document, and page objects and send to frontend
    // Confirm that document is in project and page is in document
    // Increment project views

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
