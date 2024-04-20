const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Project model
const ProjectSchema = new Schema({
  slug: { type: String, required: true, maxLength: 50, unique: true },
  title: { type: String, maxLength: 255, required: true },
  subtitle: { type: String },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
  modifiedDate: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedDate: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
  public: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [
    { type: Map }
  ],
  permissions: { type: Map },
  documents: [
    { type: Map }
  ],
  users: [
    { type: Map }
  ],
});

// Export model
module.exports = mongoose.model("project", ProjectSchema);
