const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  CoupenName: {
    type: String,
    required: true,
    unique: true,
  },
  DiscountPercentage: { 
    type: Number,
    required: true,
  },
  Description: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  EndsOn: {
    type: Date,
    required: true,
  },
  CreatedOn: {
    type: Date,
    required: true,
  },
  UpdatedOn: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
