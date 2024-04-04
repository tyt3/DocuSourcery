// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Project model
const ProjectSchema = new mongoose.Schema({
    title: {type: String}
});

// Export model
module.exports  = mongoose.model("project", ProjectSchema);
