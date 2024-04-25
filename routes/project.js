// Route handlers
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const marked = require('marked');
const turndown = require('turndown');
const turndownService = new turndown({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});
const DOMPurify = require('dompurify');
const moment = require('moment');


// Import middleware
const { ensureAuth, validateTitles, validateSlug } = require('./middleware');

// Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');
const Tag = require('../models/tag');


// FUNCTIONS
function formatModDate(projectList) {
  projectList.forEach(project => {
    // Convert the 'modifiedDate' field to a Moment.js object
    var modifiedDateMoment = moment(project.modifiedDate);

    // Format the Moment.js object as 'MM/DD/YYYY HH:MM:SS'
    var formattedDate = modifiedDateMoment.format('MM/DD/YYYY HH:mm:ss');

    // Update the 'modifiedDate' field in the project with the formatted date string
    project.dateModified = formattedDate;
  });
  return projectList;
}

function switchToBool(switchField) {
  let choice = false;
  if (switchField === "on") {
    choice = true;
  }
  return choice;
}

async function appendProjectToTags(tagList, projectId) {
  try {
    // Update all tags in tagList array
    await Promise.all(tagList.map(async (tagId) => {
        // Update the tag by its ObjectId
        const updatedTag = await Tag.findOneAndUpdate(
            { _id: tagId, projects: { $ne: projectId } }, // Query to find the tag and check if projectId is not already present
            { $addToSet: { projects: projectId } }, // Update operation
            { new: true } // Return the updated document
        );

        if (!updatedTag) {
            console.log(`Project ${projectId} already exists in tag ${tagId} or tag not found.`);
        } else {
            console.log(`Project ${projectId} appended to tag ${tagId} successfully.`);
        }
    }));
  } catch (error) {
      console.error('Error occurred:', error);
  }
}

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
    let publicChoice = switchToBool(isPublic);
    let loginChoice = switchToBool(noLogin);
    let dupChoice = switchToBool(canDuplicate);

    // Convert description markdown to HTML 
    const descriptionHTML = marked.parse(description);
    const project = new Project({
      slug: slug,
      title: title,
      subtitle: subtitle,
      description: descriptionHTML,
      createdBy: req.user._id,
      public: publicChoice,
      tags: linkedTags,
      permissions: {noLogin: loginChoice, duplicatable: dupChoice},
      users: [
        {
          user: req.user._id,
          role: 3
        }
      ]
    });

    const newProject = await project.save();

    // Update all tags in linkedTags array to add the new project ID to its projects array
    if (linkedTags) {
      appendProjectToTags(linkedTags, newProject._id);
    }

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
      populate: [
        {
          path: 'createdBy',
          select: 'username firstName lastName email'
        },
        {
          path: 'deletedBy',
          select: 'username firstName lastName email'
        },
        {
          path: 'pages',
          model: 'page',
          populate: {
            path: 'createdBy',
            select: 'username firstName lastName email'
          }
        }
      ]
    })
    .populate({
      path: 'tags', 
      model: 'tag'
    });

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
router.post("/project/edit/:id", ensureAuth, validateTitles, validateSlug,
  async (req, res) => {
    // TODO: Implement
    // Validate input, flash error message and reload if any errors

    const projectId = req.params.id;
    const {
      title,
      subtitle,
      slug,
      description,
      tags,
      noLogin,
      canDuplicate,
      isPublic,
      remove
    } = req.body;

    console.log(title, slug, isPublic);
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).send("Project not found.");
      }

      // Convert description Markdown to HTML
      const descriptionHTML = marked.parse(description);

      let publicChoice = switchToBool(isPublic);
      let loginChoice = switchToBool(noLogin);
      let dupChoice = switchToBool(canDuplicate);

      // Update the project fields
      project.title = title || project.title;
      project.subtitle = subtitle || project.subtitle; // Keep existing subtitle if none provided
      project.slug = slug || project.slug;
      project.description = descriptionHTML || document.description;
      project.public = publicChoice !== undefined ? publicChoice : project.public;
      project.modifiedDate = new Date();

      // Loop through each user ID to be removed
      const removeArray = Array.isArray(remove) ? remove : [remove];
      
      for (const userId of removeArray) {
        // Find the index of the user object with the matching ID
        const index = project.users.findIndex(userObj => userObj.user.equals(userId));
        // If found, remove the user object from the project.users array
        if (index !== -1) {
          project.users.splice(index, 1);
        }
      }

      // Handle tags similarly as in the project creation
      let linkedTags = [];
      if (tags) {
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        for (const tagTitle of tagsArray) {
          let tag = await Tag.findOne({ title: tagTitle });
          if (!tag) {
            tag = new Tag({
              title: tagTitle,
              slug: tagTitle.replace(/\s+/g, "-").toLowerCase(),
              createdBy: req.user._id,
            });
            await tag.save();
          }
          linkedTags.push(tag._id);
        }
      }
      project.tags = linkedTags;

      // Update permissions based on form input
      project.permissions.set("noLogin", loginChoice);
      project.permissions.set("duplicatable", dupChoice);

      const updProject = await project.save();

      if (linkedTags) {
        appendProjectToTags(linkedTags, updProject._id);
      }

      res.redirect(`/project/${project.slug}/edit`);
    } catch (err) {
      console.error("Error updating project:", err);
      res.status(500).send(`Server error while updating project: ${err}`);
    }
  }
);

// Delete Project
router.post("/project/delete/:id", ensureAuth, async (req, res) => {
    // TODO: Implement
    // Must be authenticated
    // Redirect to Dashboard
    // If project.deleted=false:
    // - set to deleted=true
    // - set deletedDate=now
    // - set deletedBy=authenticatedUserID
    // if project.deleted=true:
    // - delete object
  const {
      title,
      subtitle,
      slug,
      description,
      tags,
      noLogin,
      canDuplicate,
      isPublic,
      } = req.body;
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send("Project not found.");
    }

    if (project.deleted) {
      // Optional: Allow hard delete if the project is already marked as deleted.
      await Project.deleteOne({ _id: projectId });
      res.redirect(`/dashboard`);
    } else {
      // Soft delete: mark the project as deleted.
      project.deleted = true;
      project.trash = true;
      project.deletedDate = new Date();
      project.deletedBy = req.user._id; // assuming req.user._id contains the ID of the authenticated user
      project.modifiedDate = new Date();
      await project.save();
      res.redirect(`/dashboard`);
    }
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send(`Server error while deleting project: ${err}`);
  }
});

// Restore Project
router.post("/project/restore/:id", ensureAuth, async (req, res) => {

    // TODO: Implement
    // Get project by ID
    // Set deleted to false
  const projectId = req.params.id;
  const {
      title,
      subtitle,
      slug,
      description,
      tags,
      noLogin,
      canDuplicate,
      isPublic,
      } = req.body;
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send("Project not found.");
    }

    // Check if the project is actually deleted
    if (!project.deleted) {
      return res.status(400).send("Project is not marked as deleted and cannot be restored.");
    }

    // Optional: Check if the user has the right to restore the project
    if (!project.users.some(user => user.user.toString() === req.user._id.toString() && [2, 3].includes(user.role))) {
      return res.status(403).send("Unauthorized to restore this project.");
    }

    // Restore the project by setting `deleted` to false and clearing deletion details
    project.deleted = false;
    project.trash = false;
    project.deletedDate = null;
    project.deletedBy = null;
		project.modifiedDate = new Date();

    await project.save();
    res.redirect(`/project/${project.slug}/edit`);
  } catch (err) {
    console.error("Error restoring project:", err);
    res.status(500).send(`Server error while restoring project: ${err}`);
  }
});


// Add user to project
router.post('/project/add-user/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  const { username, role } = req.body;

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    
    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Check if the user is already associated with the project
    const existingUser = project.users.find(u => u.user.equals(user._id));
    if (!existingUser) {
      // Add the user to the project with the provided role
      project.users.push({ user: user._id, role: parseInt(role) });
      await project.save();
    }

    // Redirect to the project edit page
    res.redirect(`/project/${project.slug}/edit`);
    
  } catch (err) {
    console.error("Failed to add user to the project:", err);
    res.status(500).send("Server error occurred while trying to add a user to the project.");
  }
});

// Remove user from project
router.post('/project/remove-user/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  const { remove } = req.body;

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }

    // Loop through each user ID to be removed
    for (const userId of remove) {
      // Remove the user from the project
      project.users = project.users.filter(userObj => !userObj.user.equals(userId));
    }

    // Save the updated project
    await project.save();

    // Redirect to the project edit page
    res.redirect(`/project/${project.slug}/edit`);
    
  } catch (err) {
    console.error("Failed to remove user from the project:", err);
    res.status(500).send("Server error occurred while trying to remove a user from the project.");
  }
});

// Restore documents to project
router.post('/project/restore-documents/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  const { selectedDocuments } = req.body;

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }

    const docsToRestore = Array.isArray(selectedDocuments) ? selectedDocuments : [selectedDocuments];

    // Loop through the docIDs in docsToRestore, get the document from the Document model,
    // set `deleted` to false, and save the document
    for (const docId of docsToRestore) {
      // Find the document by ID
      const document = await Document.findById(docId);
      if (document) {
        // Set `deleted` to false
        document.deleted = false;
        // Save the updated document
        await document.save();
      }
    }

    // Redirect to the project edit page
    res.redirect(`/project/${project.slug}/edit`);
    
  } catch (err) {
    console.error("Failed to restore document to the project:", err);
    res.status(500).send("Server error occurred while trying to restore a document to the project.");
  }
});


// Delete documents from project
router.post('/project/delete-documents/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  const { selectedDocuments } = req.body;

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }

    // Loop through each document in `selectedDocuments` and delete it from `project.documents` if it exists
    const docsToDelete = Array.isArray(selectedDocuments) ? selectedDocuments : [selectedDocuments];

    for (const documentId of docsToDelete) {
      // Filter out the document to delete
      project.documents = project.documents.filter(doc => !doc.equals(documentId));
      // Delete document
      await Document.findByIdAndDelete(documentId);
    }

    // Save the updated project
    await project.save();

    // Redirect to the project edit page
    res.redirect(`/project/${project.slug}/edit`);
    
  } catch (err) {
    console.error("Failed to remove document from the project:", err);
    res.status(500).send("Server error occurred while trying to remove a document from the project.");
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

    // Format modified dates
    formattedProjects = formatModDate(projects);

    // Render the projects template with sorted projects
    res.render('project/projects.ejs', {
      user: req.user,
      projects: formattedProjects,
      tags: tags,
    });
  } catch (err) {
    // Handle errors
    console.error('Error:', err);
    res.status(500).send(err);
  }
});

// Pin Project
router.get('/pin/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    const pinUser = await User.findOneAndUpdate(
      { _id: req.user.id }, // Query to find the user making the request
      { $addToSet: { pinnedProjects: projectId } }, // Add project to pinned list
      { new: true } // Return the updated tag
    );
    
    // Redirect to dashboard
    res.redirect('/dashboard');
    
  } catch (err) {
    console.error("Failed to pin the selected project:", err);
    res.status(500).send("Server error occurred while trying to pin a project.");
  }
});

// Unpin Project
router.get('/unpin/:id', ensureAuth, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if the project is pinned by the authenticated user
    const user = await User.findById(userId);
    if (user.pinnedProjects.includes(projectId)) {
      // Remove the project from the user's pinnedProjects array
      user.pinnedProjects.pull(projectId);
      await user.save();
    }

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error unpinning project:', error);
    res.status(500).json({ error: 'Internal server error' });
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

  try {
    const project = await Project.findOne({ slug: projectSlug });
    if (project) {
      res.render('project/documentEdit.ejs', { 
        user: req.user,
        project: project,
        document: null, // Don't replace
        page: null // Don't replace
      });
    }
    else {
      return res.status(400).send('Invalid project slug value.');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Create Document
router.post('/document/create/:projectId', ensureAuth, async (req, res) => {
  console.log('Received form data:', req.body); // This will show all data received from the form
  const { title, description, slug, landingPage, isPublic } = req.body;
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

    // Convert description Markdown to HTML
    const descriptionHTML = marked.parse(description);

    // Get public value
    let publicChoice = switchToBool(isPublic);

    // Create a new document
    const newDocument = new Document({
      title: title,
      description: descriptionHTML,
      slug: slug,
      public: publicChoice,
      createdBy: req.user._id,
      projectId: projectId,
      landingPage: landingPage
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
      model: 'page',
      populate: {
        path: 'createdBy deletedBy',
        select: 'username firstName lastName email'
      }
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
router.post('/document/edit/:id', ensureAuth, validateSlug, validateTitles, 
async (req, res) => {
    // TODO: Implement 
    // Validate input, flash error message and reload if any errors
  const documentId = req.params.id;
  const { title, description, slug, landingPage, isPublic } = req.body;
  
  console.log(title, description, slug, landingPage, isPublic)
  try {
    // Fetch the existing document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).send('Document not found.');
    }

    // Get public value
    let publicChoice = switchToBool(isPublic);

    // Convert description Markdown to HTML
    const descriptionHTML = marked.parse(description);

    // Update the document fields
    document.title = title || document.title;
    document.description = descriptionHTML || document.description;
    document.slug = slug || document.slug;
    document.landingPage = landingPage !== undefined ? landingPage : document.landingPage;
    document.public = publicChoice !== undefined ? isPublic : document.public;
		document.modifiedDate = new Date();

    // Save the updated document
    await document.save();

    // Get project
    const project = await Project.findById(document.projectId);

    // Redirect to edit page view
    res.redirect(`/project/${project.slug}/${document.slug}/edit`);
  } catch (err) {
    console.error('Error updating document:', err);
    res.status(500).send('Server error while updating document.');
  }
});

// Delete Document
router.post("/document/delete/:id", ensureAuth, async (req, res) => {
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
      return res.status(404).send("Document not found.");
    }

    if (!document.deleted) {
      // Perform a soft delete
      document.deleted = true;
      document.deletedDate = new Date(); // Record the deletion date
      document.modifiedDate = new Date();
      document.deletedBy = userId; // Record the user who deleted the document
      await document.save();

      const project = await Project.findById(document.projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      // Redirect to edit page view
      res.redirect(`/project/${project.slug}/edit`);
    } else {
      // Perform a permanent delete
      await Document.deleteOne({ _id: documentId });
      const project = await Project.findById(document.projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      // Redirect to edit page view
      res.redirect(`/project/${project.slug}/edit`);
      //return res.send({ message: "Document permanently deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).send("Server error while deleting document.");
  }
});

// Restore Document
router.post('/document/restore/:id', ensureAuth, async (req, res) => {
    // TODO: Implement
    // Get document by ID
    // Set deleted to false
  const documentId = req.params.id;

  try {
    // Fetch the document to be restored
    const document = await Document.findById(documentId);
    if (!document) {
      // If the document is not found, send a 404 response
      return res.status(404).send('Document not found.');
    }

    // Check if the document is already active (not marked as deleted)
    if (!document.deleted) {
      // If the document is not deleted, send a 400 response
      return res.status(400).send('Document is already active and not marked as deleted.');
    }

    // Restore the document by setting 'deleted' to false
    document.deleted = false;
    document.deletedDate = null; // Optionally clear the deletion date
    document.deletedBy = null;  // Optionally clear the user who marked it as deleted
    document.modifiedDate = new Date(); // Update the modified date

    // Save the updated document
    await document.save();

    // Send a success response indicating the document has been restored
    res.send({ message: 'Document restored successfully' });
  } catch (err) {
    // If there is an error during the process, log it and send a 500 response
    console.error('Error restoring document:', err);
    res.status(500).send('Server error while restoring document.');
  }
});


// Restore pages to document
router.post('/document/restore-pages/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  const { selectedPages } = req.body;

  try {
    // Find the document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).send("Document not found.");
    }

    // Find the Project 
    const project = await Project.findById(document.projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }

    // Loop through the docIDs in pagesToRestore, get the page from the Page model,
    // set `deleted` to false, and save the page
    const pagesToRestore = Array.isArray(selectedPages) ? selectedPages : [selectedPages];

    for (const pageId of pagesToRestore) {
      // Find the document by ID
      const page = await Page.findById(pageId);
      if (page) {
        // Set `deleted` to false
        page.deleted = false;
        // Save the updated document
        await page.save();
      }
    }
    
    // Redirect to the document edit page
    res.redirect(`/project/${project.slug}/${document.slug}/edit`);
    
  } catch (err) {
    console.error("Failed to restore pages to the document:", err);
    res.status(500).send("Server error occurred while trying to restore a page to the document.");
  }
});


// Delete pages from document
router.post('/document/delete-pages/:id', ensureAuth, async (req, res) => {
  const documentId = req.params.id;
  const { selectedPages } = req.body;

  try {
    // Find the document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).send("Document not found.");
    }

    // Find the project
    const project = await Project.findById(document.projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }

    // Loop through each page in `selectedPages` and delete it from `project.pages` if it exists
    const pagesToDelete = Array.isArray(selectedPages) ? selectedPages : [selectedPages];

    for (const pageId of pagesToDelete) {
      // Filter out the page to delete
      document.pages = document.pages.filter(page => !page.equals(pageId));
      // Delete page
      await Page.findByIdAndDelete(pageId);
    }

    // Save the updated project
    await document.save();

    // Redirect to the project edit page
    res.redirect(`/project/${project.slug}/${document.slug}/edit`);
    
  } catch (err) {
    console.error("Failed to remove page from the project:", err);
    res.status(500).send("Server error occurred while trying to remove a page from the project.");
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
router.post("/page/create/:docId", ensureAuth, async (req, res) => {
  const docId = req.params.docId;
  const { title, slug, body, isPublic } = req.body;

  // Get project and document, error if not found
  const document = await Document.findById(docId);
  if (!document) {
    console.log("No document found with ID:", docId);
    return res
      .status(404)
      .send("Document not found or does not belong to the specified project.");
  }

  const project = await Project.findById(document.projectId);
  if (!project) {
    console.log("No project found with ID:", document.projectId);
    return res.status(404).send("Project not found.");
  }

  // TODO: Validate form fields

  // Convert description field Markdown to HTML
  const bodyHTML = marked.parse(body);

  // Get order for page
  const order = document.pages.length + 1;

  // Get public value
  let publicChoice = false;
  if (isPublic === "on") {
    publicChoice = true;
  }

  try {
    // Assuming you have a Page schema with projectId and docId as references
    const page = new Page({
      title: title,
      slug: slug,
      body: bodyHTML,
      public: publicChoice,
      order: order,
      createdBy: req.user._id,
      projectId: document.projectId,
      documentId: docId,
    });

    const newPage = await page.save();
    //res.status(201).json(newPage); // Return the created page as JSON
    
    // Update the documents to include this new page
    document.pages.push({
      _id: newPage._id,
      title: newPage.title,
      slug: newPage.slug,
    });
    await document.save();
    
    console.log("Document updated with new page:", document);
    // Redirect to edit page view
    res.redirect(`/project/${project.slug}/${document.slug}/${newPage.slug}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Edit Page View
router.get("/project/:projectSlug/:documentSlug/:pageSlug/edit", ensureAuth, async (req, res) => {
    try {
      // Assuming params are passed correctly via the URL
      const { projectSlug, documentSlug, pageSlug } = req.params;

      // Find project, document, and page
      const project = await Project.findOne({ slug: projectSlug });
      if (!project) {
        return res.status(404).send("Project not found.");
      }

      const document = await Document.findOne({
        slug: documentSlug,
        projectId: project._id,
      });
      if (!document) {
        return res.status(404).send("Document not found.");
      }

      const page = await Page.findOne({
        slug: pageSlug,
        documentId: document._id,
      });
      if (!page) {
        return res.status(404).send("Page not found.");
      }

      // Convert body field HTML to Markdown
      page.body = turndownService.turndown(page.body);

      // Render the edit page view with page data
      res.render("project/pageEdit.ejs", {
        user: req.user,
        page: page,
        project: project,
        document: document,
      });
    } catch (err) {
      console.error("Error loading the edit page view:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);


// Edit Page
router.post("/page/edit/:id", ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  const { title, body, slug, isPublic } = req.body;

  try {
    // Fetch the existing page
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).send("Page not found.");
    }

    // Convert body Markdown to HTML
    const bodyHTML = marked.parse(body);

    if (!title || !slug || !body) {
      req.flash(
        "error",
        "Missing required fields: title, slug, or body must not be empty."
      );
      return res.redirect(`/page/edit/${pageId}`);
    }

    // Update the page fields
    page.title = title || page.title;
    page.body = bodyHTML || page.body;
    page.slug = slug || page.slug;
    page.modifiedDate = new Date();

    let publicChoice = isPublic === "on";
    page.public = publicChoice;

    // Save the updated page
    await page.save();
    const document = await Document.findById(page.documentId);
    const project = await Project.findById(page.projectId);

    // Redirect to the page view or edit page
    res.redirect(`/project/${project.slug}/${document.slug}/${page.slug}/edit`);
  } catch (err) {
    console.error("Error updating page:", err);
    res.status(500).send("Internal Server Error while updating page.");
  }
});

// Delete Page
router.post("/page/delete/:id", ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).send("Document not found.");
    }

    if (!page.deleted) {
      page.deleted = true;
      page.deletedDate = new Date(); // Record the deletion date
      page.deletedBy = req.user._id; // Record the user who deleted the document
      page.modifiedDate = new Date();
      await page.save();
      
      const document = await Document.findById(page.documentId);
      const project = await Project.findById(page.projectId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      // Redirect to edit page view
      res.redirect(`/project/${project.slug}/${document.slug}/edit`);
    } else {
      // Perform a permanent delete
      await Page.deleteOne({ _id: pageId });
      const document = await Document.findById(page.documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      // Redirect to edit page view
      const project = await Project.findById(page.projectId);
      res.redirect(`/project/${project.slug}/${document.slug}/edit`);
    }
  } catch (err) {
    console.error("Error deleting page:", err);
    res.status(500).send("Server error while deleting page.");
  }
});


// Restore Page
router.post("/page/restore/:id", ensureAuth, async (req, res) => {
  const pageId = req.params.id;
  try {
    const page = await Page.findById(pageId);
    if (!page) {
      // If the page is not found, send a 404 response
      return res.status(404).send("Page not found.");
    }

    if (!page.deleted) {
      // If the page is not deleted, send a 400 response
      return res
        .status(400)
        .send("Page is already active and not marked as deleted.");
    }

    // Restore the page by setting 'deleted' to false
    page.deleted = false;
    page.deletedDate = null; // Optionally clear the deletion date
    page.deletedBy = null;  // Optionally clear the user who marked it as deleted
    page.modifiedDate = new Date(); // Update the modified date
    
     // Save the updated page
    await page.save();
    
    // Send a success response indicating the page has been restored
    res.send({ message: "Page restored successfully" });
  } catch (err) {
    // If there is an error during the process, log it and send a 500 response
    console.error("Error restoring page：", err);
    res.status(500).send("Server error while restoring page.");
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

    // Confirm project found, error if not
    if (!project) {
      console.log('No project found with slug:', projectSlug);
      return res.status(404).send('Project not found.');
    }

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

    var projects = await Project.find({
      tags: tag._id,
      deleted: false
    });

    formattedProjects = formatModDate(projects);

    // Render the projects with formatted dates on the tag viewer page
    res.render('project/tag.ejs', { 
      user: req.user,
      tag: tag,
      projects: formattedProjects
    });
  } catch (err) {
    throw err;
  }
});


// TRASH

// View User Trash
router.get('/trash', ensureAuth, async (req, res) => {
  try {
    trash = await Project.find({
      users: {
        user: req.user._id,
        role: 3
      },
      deleted: true
    });
    res.render('project/trash.ejs', { 
      user: req.user,
      projects: trash
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
