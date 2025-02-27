// Import route handlers
const express = require('express');
const router = express.Router();
const passport = require('./passportConfig');
const { parseDocument } = require('htmlparser2');
const { getOuterHTML } = require('domutils');

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
const Project = require('../models/project');

// FUNCTIONS
// Truncate HTML text
function truncateHtml(html, maxLength) {
  const document = parseDocument(html, { decodeEntities: true });

  let currentLength = 0;
  let truncated = false;

  // Recursive function to traverse and truncate nodes
  function truncateNode(node) {
    if (truncated) return null; // Stop processing if truncation is done

    if (node.type === 'text') {
      const text = node.data;

      if (currentLength + text.length > maxLength) {
        const remaining = maxLength - currentLength;
        node.data = text.slice(0, remaining) + '...';
        truncated = true;
      } else {
        currentLength += text.length;
      }

      return node;
    }

    if (node.children && node.children.length > 0) {
      node.children = node.children.map(truncateNode).filter(Boolean); // Process children
    }

    return node;
  }

  document.children = document.children.map(truncateNode).filter(Boolean);

  // Return valid HTML
  return getOuterHTML(document);
}


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
  await User.find({profilePublic: true}, {_id: 0, password: 0, profilePublic: 0, apiKey: 0})
    .then((profile_list) => {
      res.json(profile_list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


// Get all users for frontend
router.get("/users", ensureAuth, async function(req, res) {
  await User.find({}, 'firstName lastName username email')
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.log("Error fetching users:", err);
      res.status(500).send(err);
    });
});


// AUTH

// Sign Up
router.get('/signup', ensureNotAuth, async (req, res) => {
  try {
    res.render('user/signup.ejs', { user: null });
  } catch (err) {
    throw err;
  }
});

router.post('/signup', ensureNotAuth, checkUsernameAndEmail, validatePassword, async (req, res) => {
  const { firstName, lastName, username, email, password, passwordConf, pronouns,
  title, website, bio, photoUrl } = req.body;
  
  // TODO: implement form validation middleware
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
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      pronouns: pronouns,
      title: title,
      website: website,
      bio: bio,
      profilePhotoUrl: photoUrl
    });

    const newUser = await user.save();

    // Redirect or log the user in directly
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred during sign up: ${err}`);
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
      // Redirect the user back to the original requested URL or /dashboard if no returnTo URL is set
      const redirectUrl = req.session.returnTo || '/dashboard';
      delete req.session.returnTo; // Clear the stored returnTo URL
      return res.redirect(redirectUrl);
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
router.get('/profile/:username', ensureAuth, async (req, res) => {
  // Get user profile
  const username = req.params.username;
  try {
    // Find user profile based on username
    const userProfile = await User.findOne({ username: username });
    const userProjects = await Project.find({ 
      'users.user': userProfile._id 
    }).populate({
      path: 'createdBy',
      select: 'username firstName lastName email'
    });

    if (!userProfile) {
      return res.redirect('/');
    }
    // Render profile page
    res.render('user/profile.ejs', {
      profile: userProfile,
      user: req.user,
      projects: userProjects,
      truncateHtml: truncateHtml
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
    const updatedProfile = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { pronouns, title, website, bio, profilePhotoURL } },
      { new: true, runValidators: true }
    );

    const userProjects = await Project.find({ 'users.user': req.user._id });
    // Render profile page
    res.render('user/profile.ejs', {
      profile: updatedProfile,
      user: req.user,
      projects: userProjects
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server error: ${err}`);
  }
});

// DASHBOARD

// View Dashbard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    //console.log('Starting to fetch dashboard data for user:', req.user._id);

    // Ensure the user is part of the project users and project is neither deleted nor trashed
    const projects = await Project.find({
      'users.user': req.user._id,
      deleted: false
    }).populate({
      path: 'createdBy',
      select: 'username email' // Fetch limited data for the creator
    });

    console.log(`Found ${projects.length} projects for user: ${req.user._id}`);

    // Find pinned project list
    const pinnedIds = req.user.pinnedProjects.map(project => project._id);
    var pinnedProjs;

    if (pinnedIds) {
      pinnedProjs = await Project.find({ _id: { $in: pinnedIds } });
      pinnedProjs = pinnedProjs.map(project => ({
        ...project.toObject(),
        canEdit: project.users.some(u => u.user === req.user._id && u.role > 1),
        isCreator: project.createdBy._id === req.user._id
      }))
    }

    // Find trash
    var trash = await Project.find({
      'users.user': req.user._id,
      'users.role': 3,
      deleted: true
    }).populate({
      path: 'createdBy',
      select: 'username firstName lastName email' // Fetch limited data for the creator
    }).populate({
      path: 'deletedBy',
      select: 'username firstName lastName email' // Fetch limited data for the deleter
    });

    if (trash) {
      trash = trash.map(project => ({
        ...project.toObject(),
        canEdit: project.users.some(u => u.user === req.user._id && u.role > 1),
        isCreator: project.deletedBy._id === req.user._id
      }))
    }

    res.render('user/dashboard.ejs', {
      user: req.user,
      projects: projects.map(project => ({
        ...project.toObject(),
        canEdit: project.users.some(u => u.user === req.user._id && u.role > 1),
        isCreator: project.createdBy._id === req.user._id
      })),
      pins: pinnedProjs,
      trash: trash
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('An error occurred while fetching the dashboard data.');
  }
});


// Export router
module.exports = router;
