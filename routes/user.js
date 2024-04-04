// Route handlers
const express = require("express");
const router = express.Router();


// Import data models


// AUTH

// Sign Up
router.get('/signup', async (req, res) => {
    try {
        res.render("user/signup.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Log In
router.get('/login', async (req, res) => {
    try {
        res.render("user/login.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Log Out
router.get('/logout', async (req, res) => {
    try {
        res.render("user/index.ejs", {});
    } catch (err) {
        throw err;
    }
});

// ACCOUNT

// View Account
router.get('/account', async (req, res) => {
    try {
        res.render("user/account.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Edit Account


// PROFILE

// View Profile
router.get('/profile', async (req, res) => {
    try {
        res.render("user/profile.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Edit Profile


// DASHBOARD

// View Dashbard
router.get('/dashboard', async (req, res) => {
    try {
        res.render("user/dashboard.ejs", {});
    } catch (err) {
        throw err;
    }
});

// Export router
module.exports = router;
