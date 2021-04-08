const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const groupSchema = new Schema({
  admin: {
    type: String,
    required: true
    },
  users: {
    type: [String],
    required: true
  },
  groupid: {
    type: String,
    required: true
  },
  groupname: {
    type: String,
    required: true
  }
});
module.exports = AllGroups = mongoose.model("groups", groupSchema);