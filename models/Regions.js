const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  RegionName: {
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
  IsActive: {
    type: Boolean,
    default: true,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Region", regionSchema);
