// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  last_login: { type: Date, default: Date.now },
  profile_id: { type: Schema.Types.ObjectId, ref: "profile", unique: true }
});

// Export model
module.exports = mongoose.model("user", UserSchema);
