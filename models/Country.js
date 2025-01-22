const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  CountryName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  ISOCode: {
    type: String,
    maxlength: 10,
    sparse: true, // Optional but unique
  },
  CreatedOn: {
    type: Date,
    default: Date.now, // Default to the current timestamp
  },
  UpdatedOn: {
    type: Date,
    default: Date.now, // Default to the current timestamp
  },
  IsActive: {
    type: Boolean,
    default: true, // Default is active
  },
  IsDeleted: {
    type: Boolean,
    default: false, // Default is not deleted
  },
});

// Middleware to update the `UpdatedOn` field on updates
countrySchema.pre("save", function (next) {
  this.UpdatedOn = Date.now();
  next();
});

// Create the model
const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
