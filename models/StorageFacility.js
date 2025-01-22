const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const storageFacilitySchema = new Schema({
  User: {
    type: Schema.Types.ObjectId,
    required: true
  },
  isOwner: {
    type: Boolean, 
    required: false,
    default: true
  },
  Name: {
    type: String,
    unique: true,
    required: true
  },
  Description:{
    type: String,
  },
  OpeningTime: {
    type: String,
  },
  ClosingTime: {
    type: String,
  },
  ContactDetails: {
    type: Array,
  },
  CreatedOn: {
    type: String,
  },
  UpdatedOn: {
    type: String,
  
  },
  IsActive: {
    type: Boolean,
    default: false
  },
  IsPaid:{
    type: Boolean,
    default: false
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
  GeoLocation: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GeoLocation"
  },
  States: {
    type: Schema.Types.ObjectId,
    ref: "State"
  },
  Country: {
    type: Schema.Types.ObjectId,
    ref: "Country"
  },
  Certifications: {
        FSSAI: { type: Boolean, default: false },
        ISO: { type: [String], default: [] },
      },
    Thumbnail: {
        type: String,
        default: "https://coldstorageblobs.blob.core.windows.net/cold-storage-blob/BMCLogoLight.webp"
    },
    Images:{
      type: Array,
        default: []
    }
});

module.exports = mongoose.model("StorageFacility", storageFacilitySchema);
