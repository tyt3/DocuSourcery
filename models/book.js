// Data Model for Books
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    title: {type: String},
    author: {type: String},
  }
);

// Export model
module.exports = mongoose.model("book", BookSchema);