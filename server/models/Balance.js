const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BalanceSchema = new Schema({
  invoiceId: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    default: "Pending",
  },
  paymentCode: {
    type: Number,
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

module.exports = Balance = mongoose.model("Balances", BalanceSchema);
