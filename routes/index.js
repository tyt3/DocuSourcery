// Route handlers
const express = require('express');
const router = express.Router()

//import data models
const Book = require("../models/book");

router.get('/', async (req,res) => {
  try {
    const data = await Book.find({});
    res.render("index.ejs",{books:data});
  } catch (err) {
    throw err;
  }
});

module.exports = router;