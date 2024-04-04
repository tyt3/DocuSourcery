// Route handlers
const express = require("express");
const router = express.Router();


// Import data models


// PROJECT

// View Project
router.get('/project', async (req, res) => {
    try {
        res.render("project/project.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Create Project

// Edit Project 

// Delete Project

// Restore Project

// View Published Projects

router.get('/projects', async (req, res) => {
    try {
        res.render("project/projects.ejs", {});
    } catch (err) {
        throw err;
    }
});



// DOCUMENT

// View Document
router.get('/document', async (req, res) => {
    try {
        res.render("project/document.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Create Document

// Edit Document

// Delete Document

// Restore Document


// PAGE

// View Page
router.get('/page', async (req, res) => {
    try {
        res.render("project/page.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Create Page

// Edit Page

// Delete Page

// Restore Page


// TRASH

// View Trash
router.get('/trash', async (req, res) => {
    try {
        res.render("project/trash.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Empty Trash


// Export router
module.exports = router;
