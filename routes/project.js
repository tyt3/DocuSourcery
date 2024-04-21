// Route handlers
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const turndown = require('turndown');
const turndownService = new turndown();

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
        linkedTags.push(tag._id);
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
    const markdown = turndownService.turndown(description);

    const project = new Project({
      slug: slug,
      title: title,
      subtitle: subtitle,
      description: markdown,
      createdBy: req.user._id,
      public: publicChoice,
      tags: linkedTags,
      permissions: {noLogin: noLogin, duplicatable: canDuplicate},
      users: [
        {
          user: req.user._id,
          role: 3
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

  try {
    // Get project by its slug and populate users, documents, and pages
    const project = await Project.findOne({ slug: projectSlug })
    .populate({
      path: 'users.user', 
    })
    .populate({
      path: 'documents',
      populate: {
        path: 'pages',
        model: 'page'
      }
    }).populate({
      path: 'tags', 
      model: 'tag'
    })

    // Convert description field HTML to Markdown
    project.description = turndownService.turndown(project.description);

    res.render('project/projectEdit.ejs', { 
      user: req.user, 
      project: project,
      document: null, // Don't replace
      page: null // Don't replace
    });
  } catch (err) {
    console.error('Error:', err.message);
    throw err; // Re-throw the error to propagate it to the caller
  }
});


// Edit Project
router.put('/project/:id', ensureAuth, validateTitles, validateSlug, async (req, res) => {
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

  try {
    // Get project by its slug and populate users, documents, and pages
    const project = await Project.findOne({ slug: projectSlug })
    .populate({
      path: 'users.user', 
    })
    .populate({
      path: 'documents',
      populate: {
        path: 'pages',
        model: 'page'
      }
    }).populate({
      path: 'tags', 
      model: 'tag'
    })

    if ((project.permissions.loginRequired && req.user) || !project.permissions.loginRequired) {
      // Increment project views
      project.views += 1;
      await project.save();

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
  try {
    // Retrieve all projects where public === true and sort by views in descending order
    const projects = await Project.find({ public: true }).sort({ views: -1 });
    // Aggregate query to get all tags and sort by the length of their projects array
    const tags = await Tag.aggregate([
      {$project: {
          _id: 1,
          title: 1,
          slug: 1,
          numProjects: { $size: '$projects' } // Compute the length of the projects array
        }},
      {$sort: { numProjects: -1 }} // Sort by projectsCount in descending order
    ]);

    // Render the projects template with sorted projects
    res.render('project/projects.ejs', {
      user: req.user,
      projects: projects,
      tags: tags,
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

    // Try to get project by slug
    const project = await Project.findOne({ slug: projectSlug });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get document with project ID
    const document = await Document.findOne({
      slug: documentSlug,
      projectId: project._id
    })
    .populate({
      path: 'pages',
      model: 'page' 
    })
    .exec();
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Convert description field HTML to Markdown
    document.description = turndownService.turndown(document.description);

    // Send response
    res.render('project/documentEdit.ejs', { 
      user: req.user,
      project: project,
      document: document,
      page: null, // Don't replace 
    });
  } catch (err) {
    console.error('Error:', err.message);
    throw err; // Re-throw the error to propagate it to the caller
  }
});


// Edit Document
router.put('/document/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  const { title, description, slug, landingPage } = req.body;

  try {
    // Fetch the existing document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).send('Document not found.');
    }

    // Update the document fields
    document.title = title || document.title;
    document.description = description || document.description;
    document.slug = slug || document.slug;
    document.landingPage = landingPage !== undefined ? landingPage : document.landingPage;

    // Save the updated document
    await document.save();

    // Send a success response
    res.send({ message: 'Document updated successfully', document });
  } catch (err) {
    console.error('Error updating document:', err);
    res.status(500).send('Server error while updating document.');
  }
});

// Delete Document
router.delete('/document/:id', ensureAuth, async (req, res) => {
    // TODO: Implement
    // If document.deleted=false:
    // - set to deleted=true
    // - set deletedDate=now
    // - set deletedBy=authenticatedUserID
    // if document.deleted=true: 
    // - delete object
  const documentId = req.params.id;
  const userId = req.user._id; // Assuming req.user._id holds the authenticated user's ID

  try {
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).send('Document not found.');
    }

    if (!document.deleted) {
      // Perform a soft delete
      document.deleted = true;
      document.deletedDate = new Date(); // Record the deletion date
      document.deletedBy = userId; // Record the user who deleted the document
      await document.save();
      return res.send({ message: 'Document marked as deleted successfully' });
    } else {
      // Perform a permanent delete
      await Document.deleteOne({ _id: documentId });
      return res.send({ message: 'Document permanently deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).send('Server error while deleting document.');
  }
});

// Restore Document
router.put('/document/restore/:id', ensureAuth, async (req, res) => {
    // TODO: Implement
    // Get document by ID
    // Set deleted to false
  const documentId = req.params.id;
  try {
    // Fetch the document to be restored
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).send('Document not found.');
    }

    // Check if the document is already active (not deleted)
    if (!document.deleted) {
      return res.status(400).send('Document is already active and not marked as deleted.');
    }

    // Restore the document by setting 'deleted' to false
    document.deleted = false;
    document.modifiedDate = new Date();
    await document.save();

    // Send a success response
    res.send({ message: 'Document restored successfully' });
  } catch (err) {
    console.error('Error restoring document:', err);
    res.status(500).send('Server error while restoring document.');
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
    
    // Get project by its slug and populate users, documents, and pages
    const project = await Project.findOne({ slug: projectSlug })
    .populate({
      path: 'users.user', 
    })
    .populate({
      path: 'documents',
      populate: {
        path: 'pages',
        model: 'page'
      }
    }).populate({
      path: 'tags', 
      model: 'tag'
    })

    // Find the document within this project using the document slug and ensure it belongs to the project
    const document = await Document.findOne({
      slug: documentSlug,
      projectId: project._id
    }).populate({
      path: 'pages', 
      model: 'page'}); 

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
      page = document.pages.find(page => page.order === 1);
    }

    if ((project.permissions.loginRequired && req.user) || !project.permissions.loginRequired) {
      // Increment project views
      project.views += 1;
      await project.save();

      res.render('project/project.ejs', { 
        user: req.user,
        project: project,
        document: document,
        page: page,
        viewType: viewType
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

// PAGE

// Create Page View
router.get('/project/:projectSlug/:documentSlug/page/create', ensureAuth, async (req, res) => {
  const { projectSlug, documentSlug } = req.params;
  
  //console.log(`Attempting to fetch project with slug: ${projectSlug} and document with slug: ${documentSlug}`);
  
  // Get project and document, error if not found 
  try {
    const project = await Project.findOne({ slug: projectSlug });
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    // Confirm that document is in project
    const document = await Document.findOne({ slug: documentSlug, projectId: project._id });
    if (!document) {
      return res.status(404).send("Document not found or does not belong to the specified project.");
    }

    res.render('project/pageEdit.ejs', { 
      user: req.user,
      project: project,
      document: document,
      page: null // Don't replace
    });
  } catch (err) {
    console.error("Failed to load the page creation view:", err);
    res.status(500).send("Server error occurred while trying to load the page creation form.");
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
    // Get project, document, and page objects using slugs
    const project = await Project.findOne({ slug: projectSlug });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const document = await Document.findOne({
      slug: documentSlug,
      projectId: project._id
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const page = await Page.findOne({
      slug: pageSlug,
      documentId: document._id
    });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Convert `body` field HTML to Markdown
    page.body = turndownService.turndown(page.body);

    // Send response
    res.render('project/pageEdit.ejs', { 
      user: req.user,
      project: project,
      document: document,
      page: page,
    });
  } catch (err) {
    console.error('Error:', err.message);
    throw err; // Re-throw the error to propagate it to the caller
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
    // Get project by its slug and populate users, documents, and pages
    const project = await Project.findOne({ slug: projectSlug })
    .populate({
      path: 'users.user', 
    })
    .populate({
      path: 'documents',
      populate: {
        path: 'pages',
        model: 'page'
      }
    })

    // Find the document within this project using the document slug and ensure it belongs to the project
    const document = await Document.findOne({
      slug: documentSlug,
      projectId: project._id
    })

    if (!document) {
      return res.status(404).send('Document not found in the specified project');
    }

    // Find the page within document using the page slug and ensure it belongs to the document
    const page = await Page.findOne({
      slug: pageSlug,
      documentId: document._id
    })

    if (!page) {
      return res.status(404).send('Page not found in the specified document');
    }

    if ((project.permissions.loginRequired && req.user) || !project.permissions.loginRequired) {
      // Increment project views
      project.views += 1;
      await project.save();

      res.render('project/project.ejs', { 
        user: req.user,
        project: project,
        document: document,
        page: page,
        viewType: "page"
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
