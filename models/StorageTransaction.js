const mongoose = require("mongoose");

const StorageTransactionSchema = new mongoose.Schema({
  TransactionNumber: {
    type: String,
    required: true, 
    unique: true,
  },
  TransactionAmount: {
    type: Number,
    required: true
  },
  TransactionTime: {
    type: Date, 
    required: true
  },
  StorageFacility: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  Coupen: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  BaseAmount: {
    type: mongoose.Types.Decimal128,
    required: false,
  },
  GSTPercentage: {
    type: mongoose.Types.Decimal128,
    required: false,
  },
  GSTAmount: {
    type: mongoose.Types.Decimal128,
    required: false,
  },
  TaxInvoiceNumber: {
    type: String,
    maxlength: 50,
    required: false,
  },
  PayerGSTIN: {
    type: String,
    maxlength: 15,
    required: false,
  },
  FacilityGSTIN: {
    type: String,
    maxlength: 15,
    required: false,
  },
  TaxCategory: {
    type: String,
    maxlength: 50,
    required: false,
  },
  IsSuccess: {
    type: Boolean,
    required: true
  },
  CreatedOn: {
    type: Date,
  },
  UpdatedOn: {
    type: Date,
    default: Date.now,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("StorageTransaction", StorageTransactionSchema);
