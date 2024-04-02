// Route handlers
const express = require("express");
const router = express.Router();

// Login
router.get('/login', async (req, res) => {
  try {
    res.render("auth/login.ejs",{});
  } catch (err) {
    throw err;
  }
});

module.exports = router;
