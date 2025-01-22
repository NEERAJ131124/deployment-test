const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  Amount: {
    type: Number,
    required: true,
  },
  Type: {
    type: String,
    required: true,
    unique: true,
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
  UpdatedOn: {
    type: Date,
    default: Date.now,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Payment', PaymentSchema);
