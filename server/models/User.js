const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },

  phonenumber: {
    type: String,
  },
  companyanme: {
    type: String,
  },
  country: {
    type: String,
  },
  monthlyadspend: {
    type: String,
  },
  goals: {
    type: String,
  },
  adplatformt: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  role: {
    type: String,
    default: "lead",
  },
  last_login: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
