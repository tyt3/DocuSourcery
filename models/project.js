// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Project model
const ProjectSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  created_date: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: "user" },
  modified_date: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deleted_date: { type: Date },
  deleted_by: { type: Schema.Types.ObjectId, ref: "user" },
  tags: [
    { type: Schema.Types.ObjectId, ref: "tag" }
  ],
  permissions: { type: Map },
  landing_page: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  documents: [
    { type: Schema.Types.ObjectId, ref: "document", required: true }
  ],
  users: [
    { type: Map }
  ],
});

// Export model
module.exports = mongoose.model("project", ProjectSchema);
