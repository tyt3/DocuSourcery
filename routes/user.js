// Route handlers
const express = require("express");
const router = express.Router();

// Import middleware
const bcrypt = require("bcrypt");

// Import data model
const User = require("../models/user");
const Profile = require("../models/profile");

// AUTH

// testing Retrieve all user msg
router.get("/alllllUsers", async function (req, res) {
  await User.find({})
    .then((user_list) => {
      res.json(user_list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// testing Retrieve all profile msg
router.get("/alllllProfiles", async function (req, res) {
  await Profile.find({})
    .then((profile_list) => {
      res.json(profile_list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Sign Up
router.get("/signup", async (req, res) => {
  try {
    res.render("user/signup.ejs", {});
  } catch (err) {
    throw err;
  }
});

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password, username } = req.body;

  try {
    // Check if the email or username already exists
    const existingUserByEmail = await User.findOne({ email: email });
    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByEmail || existingUserByUsername) {
      // If either email or username exists, inform the user
      let message = "An account with this ";
      message += existingUserByEmail ? "email" : "";
      message += (existingUserByEmail && existingUserByUsername) ? " and " : "";
      message += existingUserByUsername ? "username" : "";
      message += " already exists.";
      return res.status(400).render("user/signup.ejs", { message: message });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create the User document
    const user = new User({
      username: username,
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: hashedPassword,
    });

    const newUser = await user.save();

    // Create the Profile document linked to the User
    const profile = new Profile({
      first_name: first_name,
      last_name: last_name,
      user_id: newUser._id, // Link to the user document
    });

    await profile.save();

    // Optionally, update the User document with the profile ID
    newUser.profile_id = profile._id;
    await newUser.save();

    // Redirect or log the user in directly
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during sign up.");
  }
});

// Log In
router.get("/login", async (req, res) => {
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
      //const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = await User.findOne({ password: password });
      if (isMatch) {
        // Passwords match
        console.log("user is match"); // Add this log
        // Here you might also want to handle login sessions or tokens
        res.redirect("/dashboard");
      } else {
        // Passwords don't match
        console.log("Password don't match"); // Add this log
        res
          .status(400)
          .render("user/login.ejs", { message: "Password don't match." });
      }
    } else {
      // No user found with that email
      res
        .status(401)
        .render("user/login.ejs", { message: "Invalid credentials." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

// Log Out
router.get("/logout", async (req, res) => {
  try {
    res.redirect("/");
  } catch (err) {
    throw err;
  }
});

// ACCOUNT

// View Account
router.get("/account", async (req, res) => {
  try {
    res.render("user/account.ejs", {});
  } catch (err) {
    throw err;
  }
});

// Edit Account

// PROFILE

// View Profile
router.get("/profile", async (req, res) => {
  try {
    res.render("user/profile.ejs", {});
  } catch (err) {
    throw err;
  }
});

// Edit Profile

// DASHBOARD

// View Dashbard
router.get("/dashboard", async (req, res) => {
  try {
    res.render("user/dashboard.ejs", {});
  } catch (err) {
    throw err;
  }
});

// Export router
module.exports = router;
