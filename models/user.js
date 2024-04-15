// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  profileId: { type: Schema.Types.ObjectId, ref: "profile", unique: true }
});

// Export model
module.exports = mongoose.model("user", UserSchema);
