const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Tag model
const TagSchema = new Schema({
  title: { type: String, maxLength: 50, unique: true, required: true },
  description: { type: String, required: true }
  projects: [
    { type: Schema.Types.ObjectId, ref: "project" }
  ],
  documents: [
    { type: Schema.Types.ObjectId, ref: "document" }
  ],
  pages: [
    { type: Schema.Types.ObjectId, ref: "page" }
  ],
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true }
});

// Export model
module.exports = mongoose.model("tag", TagSchema);