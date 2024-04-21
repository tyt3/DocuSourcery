const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { populateCurrentUser: populateCurrentUser } = require('../routes/middleware');


// Define Page model
const PageSchema = new Schema({
  title: { type: String, required: true, maxLength: 255 },
  slug: { type: String, required: true, maxLength: 50 },
  body: { type: String },
  order: { type: Number },
  public: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
  modifiedDate: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedDate: { type: Date, default: null },
  deletedBy: { type: Schema.Types.ObjectId, ref: "user", default: null },
  projectId: { type: Schema.Types.ObjectId, ref: "project", required: true },
  documentId: { type: Schema.Types.ObjectId, ref: "document", required: true }
});

// Apply middleware to populate createdBy, updatedBy, and deletedBy fields before saving
PageSchema.pre('save', populateCurrentUser);


// Export model
module.exports = mongoose.model("page", PageSchema);
