// Route handlers
const express = require('express');
const router = express.Router()

// //import data models
// const Book = require("../models/book");

// AUTH
router.get("/login", async function(req, res){
 console.log("hello!", req.body);
});

// // RETREIVE all books
// router.get("/", async function(req, res){
//  await Book.find({})
//     .then(book_list => {
//       res.json(book_list);
//     })
//     .catch(err => {
//       res.status(500).send(err);
//     });
// });

// // RETRIEVE a specific book
// router.get("/:bookId",async function(req, res){
//  await Book.findById(req.params.bookId)
//     .then(book => {
//       if (book) {
//         res.json(book);
//       } else {
//         res.status(404).send("Book not found");
//       }
//     })
//     .catch(err => {
//       res.status(500).send(err);
//     });
// });

// //CREATE
// router.post('/', async function(req, res){
//   console.log("new book", req.body);
//   let book = new Book(req.body);
// await  book.save();
//   res.status(201).send(book);
// });

// //UPDATE
// router.put("/:bookId", async function(req, res) {
//  await Book.findById(req.params.bookId, async function(err, book) {
//     book.title = req.body.title;
//     book.author = req.body.author;
// await    book.save();
//     res.json(book);
//   });
// });

// //DELETE
// router.delete("/:bookId", async function(req, res){
//  await Book.findById(req.params.bookId, async function(err, book) {
//   await  book.remove(function(err){
//         if(err){
//           res.status(500).send(err);
//         }
//         else{
//           res.status(204).send('removed');
//         }
//     });
//   });
// });


// Export router
module.exports = router;
