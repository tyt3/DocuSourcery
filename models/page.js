const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define User model
const PageSchema = new Schema({
  title: { type: String, required: true, maxlength: 255 },
  slug: { type: String, required: true, maxlength: 50 },
  body: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'user', default: null },
  projectId: { type: Schema.Types.ObjectId, ref: 'project', required: true },
  documentId: { type: Schema.Types.ObjectId, ref: 'document', required: true }
});

// Apply middleware to populate createdBy, updatedBy, and deletedBy fields before saving
pageSchema.pre('save', populateCreatedBy);


// Export model
module.exports = model("page", PageSchema);