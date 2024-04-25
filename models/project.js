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
  trash: { type: Boolean, default: false },
  deletedDate: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
  public: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [
    { type: Schema.Types.ObjectId, ref: "tag" }
  ],
  permissions: { type: Map },
  documents: [
    { type: Schema.Types.ObjectId, ref: "document" }
  ],
  users: [{
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    role: {
        type: Number,
        enum: [0, 1, 2, 3] // 0 for viewer, 1 for collaborator, 2 for admin, 3 for owner
    }
}]
});

// Export model
module.exports = mongoose.model("project", ProjectSchema);
