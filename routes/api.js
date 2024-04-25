// // Route handlers
const express = require('express');
const router = express.Router();
const marked = require('marked');

// // Import middleware
const { checkApiKey, validateTitles, validateSlug } = require('./middleware');

// // Import data models
const User = require('../models/user');
const Project = require('../models/project');
const Document = require('../models/document');
const Page = require('../models/page');
const Tag = require('../models/tag');


// USERS

// Get all users 
router.get("/users", checkApiKey, async function(req, res) {
  await User.find({})
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Get user by username
router.get("/users/:username", checkApiKey, async function(req, res) {
  const userName = req.params.username;
  try {
    const user = await User.findOne({ username: userName });
    if (user) {
      res.status(200).json(user);
    }
    else {
      res.status(204).json({'No Response': 'No users exist with the provided username'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// PROJECT

// Get all projects
router.get("/projects", checkApiKey, async function(req, res) {
  await Project.find({})
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Get project by slug
router.get("/projects/:slug", checkApiKey, async function(req, res) {
  const projectSlug = req.params.slug;
  try {
    const project = await Project.findOne({ slug: projectSlug });
    if (project) {
      res.status(200).json(project);
    }
    else {
      res.status(204).json({'No Response': 'No projects exist with the provided slug'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Get all documents under a project
router.get("/projects/:slug/documents", checkApiKey, async function(req, res) {
  const projectSlug = req.params.slug;
  try {
    const project = await Project.findOne({ slug: projectSlug });
    if (project) {
	  const docs = await Document.find({'_id': { $in: project.documents}}).exec();
      res.status(200).json(docs);
    }
    else {
      res.status(204).json({'No Response': 'No documents exist under the provided project'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Get all pages under a project
router.get("/projects/:slug/pages", checkApiKey, async function(req, res) {
  const projectSlug = req.params.slug;
  try {
    const project = await Project.findOne({ slug: projectSlug });
    if (project) {
	  const pages = await Page.find({'projectId': project._id }).exec();
      res.status(200).json(pages);
    }
    else {
      res.status(204).json({'No Response': 'No pages exist under the provided project'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Create Project
router.post('/create/projects', checkApiKey, async (req, res) => {
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
    // Convert description markdown to HTML
    const descriptionHTML = marked.parse(description);
    const project = new Project({
      slug: slug,
      title: title,
      subtitle: subtitle,
      description: descriptionHTML,
      createdBy: req.user._id,
      public: isPublic,
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

    // Update all tags in linkedTags array to add the new project ID to its projects array
    if (linkedTags) {
	  // Update all tags in tagList array
	  await Promise.all(linkedTags.map(async (tagId) => {
        // Update the tag by its ObjectId
        await Tag.findOneAndUpdate(
            { _id: tagId, projects: { $ne: newProject._id } }, // Query to find the tag and check if projectId is not already present
            { $addToSet: { projects: newProject._id } } // Update operation
        );
      }));
    }
    // Return the new project
    res.status(200).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during project creation: ${err}`);
  }
});

// Edit Project
router.put("/projects/:id", checkApiKey, validateTitles, validateSlug,
	async (req, res) => {
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
		  res.status(404).send("Project not found.");
		}
  
		// Convert description Markdown to HTML
		const descriptionHTML = marked.parse(description);
  
		// Update the project fields
		project.title = title || project.title;
		project.subtitle = subtitle || project.subtitle; // Keep existing subtitle if none provided
		project.slug = slug || project.slug;
		project.description = descriptionHTML || project.description;
		project.public = isPublic !== undefined ? isPublic : project.public;
		project.modifiedDate = new Date;
  
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
		project.permissions.set("noLogin", noLogin);
		project.permissions.set("duplicatable", canDuplicate);
  
		const updProject = await project.save();
  
		if (linkedTags) {
		  // Update all tags in tagList array
		  await Promise.all(linkedTags.map(async (tagId) => {
			// Update the tag by its ObjectId
			await Tag.findOneAndUpdate(
			  { _id: tagId, projects: { $ne: updProject._id } }, // Query to find the tag and check if projectId is not already present
			  { $addToSet: { projects: updProject._id } } // Update operation
			);
		  }));
		}
		res.status(200).json(updProject);

	  } catch (err) {
		console.error("Error updating project:", err);
		res.status(500).send(`Server error while updating project: ${err}`);
	  }
	}
  );

// DOCUMENT

// Get all documents
router.get("/documents", checkApiKey, async function(req, res) {
  await Document.find({})
    .then(documents => {
      res.status(200).json(documents);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Get document by slug
router.get("/documents/:slug", async function(req, res) {
  const documentSlug = req.params.slug;
  try {
    const document = await Document.findOne({ slug: documentSlug });
    if (document) {
      res.status(200).json(document);
    }
    else {
      res.status(204).json({'No Response': 'No documents exist with the provided slug'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Get all pages under a document
router.get("/documents/:slug/pages", checkApiKey, async function(req, res) {
  const documentSlug = req.params.slug;
  try {
    const document = await Document.findOne({ slug: documentSlug });
    if (document) {
	  if (document.pages.length > 0) {
		const pages = await Page.find({'_id': { $in: document.pages}}).exec();
		res.status(200).json(pages);
	  }
	  res.status(204).json({'No Response': 'No pages exist under the provided document'}); 
    }
    else {
      res.status(404).json({'Error': 'Document not found'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Create Document
router.post('/create/documents', checkApiKey, validateSlug, validateTitles, async (req, res) => {
  const { title, description, slug, landingPage, isPublic, projectId, order } = req.body;

  try {
    let proj = await Project.findById(projectId);
	if (!proj) {
	  res.status(400).json({'Error': "Invalid project ID provided"})
	} else {
	  const descriptionHTML = marked.parse(description);
	  const document = new Document({
		slug: slug,
		title: title,
		description: descriptionHTML,
		createdBy: req.user._id,
		projectId: proj._id,
		landingPage: landingPage,
		public: isPublic,
		order: order
	  });
	
	  const newDoc = await document.save();
	
	  // Return the new document
	  res.status(200).json(newDoc);
	}
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during document creation: ${err}`);
  }
});

// Edit Document
router.put('/documents/:id', checkApiKey, validateSlug, validateTitles, async (req, res) => {
  const docId = req.params.id;
  const { title, description, slug, landingPage, isPublic, projectId, order } = req.body;

  try {
    let proj;
    if (projectId) {
      proj = await Project.findById(projectId);
    }
    else {
      proj = true;
    }
	if (!proj) {
	  res.status(400).json({'Error': "Invalid project ID provided"})
	} else {
	  let document = await Document.findById(docId);
	  if (!document) {
	    res.status(404).send("Document not found.");
	  }

      // Convert description markdown to HTML
	  const descriptionHTML = marked.parse(description);

	  // Update the project fields
	  document.title = title || document.title;
	  document.slug = slug || document.slug;
	  document.description = descriptionHTML || document.description;
	  document.landingPage = landingPage !== undefined ? landingPage : document.landingPage;
	  document.public = isPublic !== undefined ? isPublic : document.public;
	  document.projectId = projectId || document.projectId;
	  document.order = order || document.order;
	  document.modifiedDate = new Date;

      const updDoc = await document.save();

      // Return the new document
      res.status(200).json(updDoc);
	}
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during document update: ${err}`);
  }
});

// PAGE

// Get all pages
router.get("/pages", checkApiKey, async function(req, res) {
  await Page.find({})
    .then(pages => {
      res.status(200).json(pages);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Get page by slug
router.get("/pages/:slug", checkApiKey, async function(req, res) {
  const pageSlug = req.params.slug;
  try {
    const page = await Page.findOne({ slug: pageSlug });
    if (page) {
      res.status(200).json(page);
    }
    else {
      res.status(204).json({'No Response': 'No pages exist with the provided slug'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Create Page
router.post('/create/pages', checkApiKey, validateSlug, validateTitles, async (req, res) => {
  const { title, slug, body, order, isPublic, projectId, documentId } = req.body;

  try {
    let proj = await Project.findById(projectId);
    let doc = await Document.findById(documentId);
	if (!proj || !doc) {
	  res.status(400).json({'Error': "Invalid project or document ID provided"})
	} else {
	  const bodyHTML = marked.parse(body);
	  const page = new Page({
		slug: slug,
		title: title,
		body: bodyHTML,
		createdBy: req.user._id,
		projectId: proj._id,
		documentId: doc._id,
		public: isPublic,
		order: order
	  });

	  const newPage = await page.save();

	  // Return the new page
	  res.status(200).json(newPage);
	}
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during page creation: ${err}`);
  }
});

// Edit Page
router.put('/pages/:id', checkApiKey, validateSlug, validateTitles, async (req, res) => {
  const pageId = req.params.id;
  const { title, slug, body, order, isPublic, projectId, documentId, order } = req.body;

  try {
    var projCheck = false;
    var docCheck = false;
    if (projectId) {
      const proj = await Project.findById(projectId);
      if (proj) {
        projCheck = true;
      }
    }
    else {
      projCheck = true;
    }
    if (documentId) {
      const doc = await Document.findById(documentId);
      if (doc) {
        docCheck = true;
      }
    }
    else {
      docCheck = true;
    }

	if (projCheck && docCheck) {
	  let page = await Page.findById(pageId);
	  if (!page) {
	    res.status(404).send("Page not found.");
	  }

      // Convert body markdown to HTML
	  const bodyHTML = marked.parse(body);

	  // Update the project fields
	  page.title = title || page.title;
	  page.slug = slug || page.slug;
	  page.body = bodyHTML || page.body;
	  page.public = isPublic !== undefined ? isPublic : page.public;
	  page.projectId = projectId || page.projectId;
	  page.order = order || page.order;
	  page.modifiedDate = new Date;

      const updPage = await page.save();

      // Return the new page
      res.status(200).json(updPage);

	} else {
	  res.status(400).json({'Error': "Invalid project or page ID provided"})
	}
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during page update: ${err}`);
  }
});

// TAG

// Get all tags
router.get("/tags", checkApiKey, async function(req, res) {
  await Tag.find({})
    .then(tags => {
      res.status(200).json(tags);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Get tag by slug
router.get("/tags/:slug", checkApiKey, async function(req, res) {
  const tagSlug = req.params.slug;
  try {
    const tag = await Tag.findOne({ slug: tagSlug });
    if (tag) {
      res.status(200).json(tag);
    }
    else {
      res.status(204).json({'No Response': 'No tags exist with the provided slug'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Create a tag
router.post("/create/tags", checkApiKey, validateSlug, async (req, res) => {
  const { title, slug, description, projects } = req.body;
  try {
    if (Array.isArray(projects)) {
      for (let projId of projects) {
        let proj = await Project.findOne({ _id: projId });
        if (!proj) {
          res.status(400).json({'Error': "Invalid project ID provided"})
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred while checking tag's linked projects: ${err}`);
  }

  try {
    const tag = new Tag({
      slug: slug,
      title: title,
      description: description,
      createdBy: req.user._id,
      projects: projects
    });
    const newTag = await tag.save();
    if (newTag) {
      res.status(200).json(newTag);
    }
    else {
      res.status(400).json({'Error': 'Could not create a tag with the provided values'});
    }
  } catch (err) {
    res.status(500).send(err)
  }
});

// Export router
module.exports = router;
