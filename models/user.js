// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const UserSchema = new mongoose.Schema({
    title: {type: String}
});

// Export model
module.exports  = mongoose.model("user", UserSchema);
