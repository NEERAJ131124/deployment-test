const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
  },
  PhoneNumber: {
    type: String,
    unique: true,
    maxlength: 13,
  },
  FirstName: {
    type: String,
    maxlength: 255, // Can be captured later during profile completion
  },
  LastName: {
    type: String,
    maxlength: 255, // Can be captured later during profile completion
  },
  GeoLocationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeoLocation",
    // required: true,
  },
  EmailVerified:{
    type:Boolean,
    default: false,
  },
  PhoneVerified:{
    type:Boolean,
    default: false,
  },
  RoleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: false,
  },
  ProfilePicture: {
    type: String,
    default: "https://coldstorageblobs.blob.core.windows.net/cold-storage-blob/BMCLogoLight.webp"
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
  UpdatedOn: {
    type: Date,
    default: Date.now,
  },
  IsVerified:{
    type: Boolean,
    default: false,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
  CreatedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  UpdatedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }
});

module.exports = mongoose.model("User", userSchema);
