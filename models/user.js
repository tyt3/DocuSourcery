// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  website: { type: String },
  pronouns: { type: String },
  title: { type: String },
  bio: { type: String },
  profilePhotoUrl: { type: String },
  profilePublic: { type: Boolean, default: false },
  projects: [
    { type: Map }
  ],
  pinnedProjects: [
    { type: Map }
  ],
  apiKey: { type: String, minLength: 20, maxLength: 128, unique: true }
});

// Export model
module.exports = mongoose.model("user", UserSchema);
