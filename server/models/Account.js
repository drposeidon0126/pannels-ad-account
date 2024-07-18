const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  bmId: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: Number,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
  },
  facebookOne: {
    type: String,
  },
  facebookTwo: {
    type: String,
  },
  currency: {
    type: String,
    default: "usd",
  },
  link: {
    type: String,
  },
  status: {
    type: String,
    default: "Submitted",
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

module.exports = mongoose.model("Account", AccountSchema);
