const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Profile model
const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  website: { type: String, unique: true },
  pronouns: { type: String },
  title: { type: String },
  bio: { type: String },
  profilePhotoUrl: { type: String },
  profilePublic: { type: Boolean, default: false },
  following: [
    { type: Map }
  ],
  followers: [
    { type: Map }
  ],
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true }
});

// Export model
module.exports = mongoose.model("profile", ProfileSchema);
