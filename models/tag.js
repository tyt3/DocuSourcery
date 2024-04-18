const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Tag model
const TagSchema = new Schema({
  title: { type: String, maxLength: 50, unique: true, required: true },
  slug: { type: String, required: true, maxLength: 50 },
  description: { type: String },
  projects: [
    { type: Map }
  ],
  documents: [
    { type: Map }
  ],
  pages: [
    { type: Map }
  ],
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true }
});

// Export model
module.exports = mongoose.model("tag", TagSchema);