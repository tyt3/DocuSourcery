const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Tag model
const TagSchema = new Schema({
  title: { type: String, maxLength: 50, unique: true, required: true },
  description: { type: String, required: true }
  projects: [
    { type: Schema.Types.ObjectId, ref: "project", required: true }
  ],
  documents: [
    { type: Schema.Types.ObjectId, ref: "document", required: true }
  ],
  pages: [
    { type: Schema.Types.ObjectId, ref: "page", required: true }
  ],
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true }
});

// Export model
module.exports = mongoose.model("tag", TagSchema);