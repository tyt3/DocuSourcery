const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const ProfileSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    website: { type: String, unique: true },
    pronouns: { type: String },
    title: { type: String },
    bio: { type: String },
    profile_photo_url: { type: String },
    profile_public: { type: Boolean, default: false },
    following: [
        { type: Schema.Types.ObjectId, ref: "profile" }
    ],
    followers: [
        { type: Schema.Types.ObjectId, ref: "profile" }
    ],
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true }
});

// Export model
module.exports  = mongoose.model("profile", ProfileSchema);
