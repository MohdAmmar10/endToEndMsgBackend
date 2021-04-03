const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true
    },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phno: {
    type: String,
    required: true
  },
  groups: {
    type: [String],
  },
  pendingrequests: {
    type: [String],
  },
  friends: {
    type: [String],
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model("users", userSchema);