// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Project model
const ProjectSchema = new mongoose.Schema({
    slug: { type: String, required: true },
    admins: [
        { type: Schema.Types.ObjectId, ref: "user", required: true }
    ],
    editors: [
        { type: Schema.Types.ObjectId, ref: "user" }
    ],
    viewers: [
        { type: Schema.Types.ObjectId, ref: "user" }
    ],
    invitees: [
        { type: Schema.Types.ObjectId, ref: "user" }
    ],
    documents:  [
        { type: Schema.Types.ObjectId, ref: "document", required: true }
    ]
});

// Export model
module.exports  = mongoose.model("project", ProjectSchema);
