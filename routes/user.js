// Import route handlers
const express = require('express');
const router = express.Router();
const passport = require('./passportConfig');

// Import middleware
const { 
  ensureAuth, 
  ensureNotAuth, 
  checkUsernameAndEmail, 
  checkAuthUsernameAndEmail,
  validatePassword,  
} = require('./middleware');
const bcrypt = require('bcrypt');

// Import data model
const User = require('../models/user');
const Profile = require('../models/profile');

// AUTH
// testing Retrieve all user msg
router.get('/alllllUsers', async function (req, res) {
  await User.find({})
    .then((user_list) => {
      res.json(user_list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// testing Retrieve all profile msg
router.get('/alllllProfiles', async function (req, res) {
  await Profile.find({})
    .then((profile_list) => {
      res.json(profile_list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Sign Up
router.get('/signup', ensureNotAuth, async (req, res) => {
  try {
    res.render('user/signup.ejs', { user: null });
  } catch (err) {
    throw err;
  }
});

router.post('/signup', ensureNotAuth, checkUsernameAndEmail, validatePassword, async (req, res) => {
  const { first_name, last_name, email, password, username } = req.body;

  try {
    // Check if the email or username already exists
    const existingUserByEmail = await User.findOne({ email: email });
    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByEmail || existingUserByUsername) {
      // If either email or username exists, inform the user
      let message = 'An account with this ';
      message += existingUserByEmail ? 'email' : '';
      message += (existingUserByEmail && existingUserByUsername) ? ' and ' : '';
      message += existingUserByUsername ? 'username' : '';
      message += ' already exists.';
      return res.status(400).render('user/signup.ejs', { message: message });
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
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred during sign up.');
  }
});

// Log In
router.get('/login', ensureNotAuth, async (req, res) => {
  try {
    const useEmail = req.query.email === 'true';
    res.render('user/login.ejs', { useEmail: useEmail, user: null });
  } catch (err) {
    throw err;
  }
});

router.post('/login', ensureNotAuth, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication Error: ', err);
      return next(err);
    }
    if (!user) {
      console.log('Login Failed: ', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login Error: ', err);
        return next(err);
      }
      // Redirect the user back to the stored URL or dashboard if no stored URL
      const redirectTo = req.session.returnTo || '/dashboard';
      delete req.session.returnTo; // Clear the stored URL from session
      return res.redirect(redirectTo);
    });
  })(req, res, next);
});


// Log Out
router.get('/logout', ensureAuth, async (req, res) => {
  try {
    req.logout((err) => { // Provide a callback function
      if (err) {
        console.error('Logout Error: ', err);
        res.redirect('/'); 
      } else {
        res.redirect('/'); 
      }
    });
  } catch (err) {
    console.error('Logout Error: ', err);
    res.redirect('/'); 
  }
});



// ACCOUNT

// View Account
router.get('/account', ensureAuth, async (req, res) => {
  try {
    res.render('user/account.ejs', { user: req.user });
  } catch (err) {
    throw err;
  }
});

// Edit Account
router.put('/account', ensureAuth, checkAuthUsernameAndEmail, validatePassword, async (req, res) => {
  // TODO: Get form data
  try {
    // TODO: Implement
  } catch (err) {
    throw err;
  }
});

// PROFILE

// View Profile
router.get('/profile/:id', ensureAuth, async (req, res) => {
  // Get user profile
  const profileId = req.params.id;
  try {
    // Find user profile based on profileId
    const userProfile = await Profile.findOne({ _id: profileId });

    if (!userProfile) {
      return res.redirect('/');
    }
    // Render profile page
    res.render('user/profile.ejs', {
      profile: userProfile,
      user: req.user,
      projects: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the user profile.');
  }
});

// Edit Profile
router.post('/profile', ensureAuth, async (req, res) => {
  try {
    const { pronouns, title, website, bio, profilePhotoURL } = req.body;
    const updatedProfile = await Profile.findOneAndUpdate(
      { user_id: req.user._id },
      { $set: { pronouns, title, website, bio, profilePhotoURL } },
      { new: true, runValidators: true }
    );
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DASHBOARD

// View Dashbard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    res.render('user/dashboard.ejs', { 
      user: req.user, 
      projects: [], // TODO: Get list of projects where user role>=1
      trash: false // TODO: Check if any of these projects have been deleted 
    });
  } catch (err) {
    throw err;
  }
});


// Export router
module.exports = router;
