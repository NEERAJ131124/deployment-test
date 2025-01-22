const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  StateName: {
    type: String,
    required: true,
    unique: true,
  },
  CountryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country", // Reference to Country model
    required: true,
  },
  RegionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
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

module.exports = mongoose.model("State", stateSchema);
