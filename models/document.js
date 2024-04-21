const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Document model
const DocumentSchema = new Schema({
  slug: { type: String, required: true, maxLength: 50 },
  title: { type: String, required: true, maxLength: 255 },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
  modifiedDate: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedDate: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
  landingPage: { type: Boolean, default: false },
  order: { type: Number },
  projectId: { type: Schema.Types.ObjectId, ref: "project", required: true },
  pages: [
    { type: Schema.Types.ObjectId, ref: "page" }
  ]
});

// Export model
module.exports = mongoose.model("document", DocumentSchema);
