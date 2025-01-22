const mongoose = require("mongoose");

const coldStorageGoodsSchema = new mongoose.Schema({
  Category: {
    type: String,
    required: true,
    enum: [
      'Food and Beverages',
      'Pharmaceuticals and Medical Supplies',
      'Chemicals and Industrial Products',
      'Flowers and Plants',
      'Cosmetics and Personal Care Products',
      'Electronics',
      'Specialized Goods'
    ]
  },
  SubCategory: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  Description: {
    type: String,
    maxlength: 1000,
  },
  TemperatureRequirement: {
    type: String,
    maxlength: 100,
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
  UpdatedOn: {
    type: Date,
    default: Date.now,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
});

// Middleware to update the `UpdatedOn` field on updates
coldStorageGoodsSchema.pre("save", function (next) {
  this.UpdatedOn = Date.now();
  next();
});

// Create the model
const ColdStorageGoods = mongoose.model("ColdStorageGoods", coldStorageGoodsSchema);

module.exports = ColdStorageGoods;
