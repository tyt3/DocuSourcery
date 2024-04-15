const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const DocumentSchema = new Schema({
  slug: { type: String, required: true, maxLength: 50 },
  title: { type: String, required: true, maxLength: 255 },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
  modifiedDate: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedDate: { type: Date, default: null },
  deletedBy: { type: Schema.Types.ObjectId, ref: "user", default: null },
  tags: [
    { type: Schema.Types.ObjectId, ref: "tag" }
  ],
  landingPage: { type: Boolean, default: false },
  projectId: { type: Schema.Types.ObjectId, ref: "project", required: true },
  pages: [
    { type: Schema.Types.ObjectId, ref: "page", required: true }
  ]
});

// Export model
module.exports = mongoose.model("document", DocumentSchema);
