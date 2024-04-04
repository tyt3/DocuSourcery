// Route handlers
const express = require("express");
const router = express.Router();

// Import middleware
const bcrypt = require('bcrypt');

// Import data model
const User = require('../models/user');


// AUTH

// Sign Up
router.get('/signup', async (req, res) => {
    try {
        res.render("user/signup.ejs", {});
    } catch (err) {
        throw err;
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            // User already exists
            return res.status(400).render("user/signup.ejs", { message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user
        const user = new User({
            email: email,
            password: hashedPassword,
            // Add other fields as necessary
        });

        await user.save();

        // Redirect or log the user in directly
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during sign up.");
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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            // Check if password matches
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Passwords match
                // Here you might also want to handle login sessions or tokens
                res.redirect("/dashboard");
            } else {
                // Passwords don't match
                res.status(400).render("user/login.ejs", { message: "Invalid credentials." });
            }
        } else {
            // No user found with that email
            res.status(400).render("user/login.ejs", { message: "Invalid credentials." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

// Log Out
router.get('/logout', async (req, res) => {
    try {
        res.redirect("/");
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
