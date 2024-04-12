const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model
const DocumentSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  created_date: { type: Date },
  modified_date: { type: Date },
  is_public: { type: Boolean, default: false },
  project_id: { type: Schema.Types.ObjectId, ref: "project", required: true },
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
  pages: [
    { type: Schema.Types.ObjectId, ref: "page", required: true }
  ]
});

// Export model
module.exports = mongoose.model("document", DocumentSchema);
