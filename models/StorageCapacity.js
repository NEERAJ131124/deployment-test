const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const capacitySchema = new Schema({
  StorageTypeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "StorageType"
  },
  StorageFacilityId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "StorageFacility"
  },
  StorageCapacity: {
    type: String,
    required: true
  },
  CapacityUnit: {
    type: String,
    required: true
  },
  Pricing:{
    type: String,
    // required: true
  },
  RemainingCapacity: {
    type: String,
    // required: true
  } ,
  IsAvailable:{
    type: Boolean,
    // required: false,
    default: true
  },
  PricingPerUnit:{
    type: String,
    // required: true
  },
  CreatedOn: {
    type: Date,
    required: false
  },
  UpdatedOn: {
    type: Date,
    required: false,
    default: Date.now
  },
  IsActive: {
    type: Boolean,
    require: false,
    default: true
  },
  IsDeleted: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = mongoose.model("StorageCapacity", capacitySchema);
