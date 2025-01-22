const mongoose = require("mongoose");

const storageTypeSchema = new mongoose.Schema({
  Type: { type: String, required: true, unique: true },
  CreatedOn: { type: Date, default: Date.now },
  UpdatedOn: { type: Date, default: Date.now },
  IsActive: { type: Boolean, default: true },
  IsDeleted: { type: Boolean, default: false },
});

// Middleware to update the UpdatedOn field before saving
storageTypeSchema.pre("save", function (next) {
  this.UpdatedOn = Date.now();
  next();
});

// Middleware to update the UpdatedOn field before updating
storageTypeSchema.pre("findOneAndUpdate", function (next) {
  this.set({ UpdatedOn: Date.now() });
  next();
});

const StorageType = mongoose.model("StorageType", storageTypeSchema);

module.exports = StorageType;
