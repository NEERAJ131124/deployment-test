const mongoose = require("mongoose");

const storageFacilityGoodsSchema = new mongoose.Schema({
  StorageFacilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StorageFacility', // Reference to StorageFacility model
    required: true,
  },
  ColdStorageGoodsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ColdStorageGoods', // Reference to ColdStorageGoods model
    required: true,
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

storageFacilityGoodsSchema.pre("save", function (next) {
  this.UpdatedOn = Date.now();
  next();
});

// Create the model
const StorageFacilityGoods = mongoose.model("StorageFacilityGoods", storageFacilityGoodsSchema);

module.exports = StorageFacilityGoods;
