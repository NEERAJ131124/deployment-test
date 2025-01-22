const mongoose = require("mongoose");

const GstDetailSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Service", "Product", "Import", "Export"], // Adjust based on valid types
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    gst: {
      type: Number,
      required: true,
      min: 0,
      max: 100, 
    },
    gstAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    hsnOrSacCode: {
      type: String,
      required: false,
      trim: true,
    },
    gstType: {
      type: String,
      required: true,
      enum: ["CGST", "SGST", "IGST", "UTGST"],
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    invoiceNumber: {
      type: String,
      required: false,
      trim: true,
    },
    partyName: {
      type: String,
      required: false,
      trim: true,
    },
    gstin: {
      type: String,
      required: false,
      trim: true,
    },
    taxableValue: {
      type: Number,
      required: true,
      min: 0,
    },
    isReverseCharge: {
      type: Boolean,
      required: false,
      default: false,
    },
    createdOn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedOn: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: String,
      required: false,
      trim: true,
    },
    remarks: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const GstDetail = mongoose.model("GstDetail", GstDetailSchema);

module.exports = GstDetail;
