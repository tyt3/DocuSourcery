const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const TagSchema = new Schema({
  title: { type: String, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  dateCreated: { type: Date, default: Date.now }
});

// Export model
module.exports = mongoose.model("tag", TagSchema);