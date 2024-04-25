const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Tag model
const TagSchema = new Schema({
  title: { type: String, maxLength: 255, unique: true, required: true },
  slug: { type: String, required: true, maxLength: 50 },
  description: { type: String },
  projects: [
    { type: Schema.Types.ObjectId, ref: "project" }
  ],
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true }
});

// Export model
module.exports = mongoose.model("tag", TagSchema);