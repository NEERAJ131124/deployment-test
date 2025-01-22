const mongoose = require("mongoose");

const geoLocationSchema = new mongoose.Schema({
  StreetAddress: {
    type: String,
    maxlength: 255,
    required: true,
  },
  District: {
    type: String,
    maxlength: 100,
    required: false,
  },
  City: {
    type: String,
    maxlength: 100,
    required: true,
  },
  State: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    // required: true,
  },
  Region:{
    type: String,
    maxlength: 100,
    required: false,
  },
  Country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    // required: true,
  },
  Pincode: {
    type: String,
    maxlength: 20,
    required: true,
  },
  Latitude: {
    type: Number,
    required: true,
  },
  Longitude: {
    type: Number,
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

module.exports = mongoose.model("GeoLocation", geoLocationSchema);
