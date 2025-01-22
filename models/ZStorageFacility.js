// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const StorageTypeSchema = new Schema({
//   Type: {
//     type: String,
//     required: true,
//     enum: ['Frozen', 'Chilled', 'Ambient', 'Other'],
//   },
//   TemperatureRange: {
//     Min: { type: Number, required: true },
//     Max: { type: Number, required: true },
//   },
//   Capacity: {
//     Total: { type: Number, required: true },
//     Available: { type: Number, required: true },
//   },
//   Pricing: [
//     {
//       PricePerUnitCapacity: { type: Number, required: true },
//       UnitType: { type: String, required: true, enum: ['Cubic Meter', 'Metric Ton'] },
//       PriceUnit: { type: String, required: true, enum: ['Per Day', 'Per Month', 'Per Year'] },
//       Variations: [
//         {
//           DurationType: { type: String, enum: ['Short-Term', 'Long-Term'], required: true },
//           Price: { type: Number, required: true },
//         },
//       ],
//     },
//   ],
// });

// const StorageFacilitySchema = new Schema({
//   FacilityName: { type: String, required: true, immutable: true },
//   OwnerName: { type: String, required: true, immutable: true },
//   ContactInfo: {
//     type: [String],
//     required: true,
//   },
//   GeoLocationID: { type: Schema.Types.ObjectId, ref: "GeoLocation", required: true },
//   StorageDetails: [StorageTypeSchema],
//   SupportedGoods: {
//     FreshProduce: { type: Boolean, default: false },
//     ProcessedAndFrozenFood: { type: Boolean, default: false },
//     Botanicals: { type: Boolean, default: false },
//     BioPharmaceuticals: { type: Boolean, default: false },
//     Cosmetics: { type: Boolean, default: false },
//     Chemicals: { type: Boolean, default: false },
//     OrganicTextiles: { type: Boolean, default: false },
//     ClimateControlled: { type: Boolean, default: false },
//   },
//   Features: {
//     PowerBackup: { type: Boolean, default: false },
//     SecurityFeatures: { type: [String], default: [] },
//   },
//   InsuranceDetails: {
//     GoodsInsuranceCoverage: { type: Boolean, default: false },
//     LiabilityLimit: { type: Number },
//   },
//   Certifications: {
//     FSSAI: { type: Boolean, default: false },
//     ISO: { type: [String], default: [] },
//   },
//   OperatingHours: {
//     StartTime: { type: String },
//     EndTime: { type: String },
//   },
//   CreatedOn: {
//     type: String,
//   },
//   UpdatedOn: {
//     type: String,
//   },
//   IsActive: {
//     type: Boolean,
//     default: false
//   },
//   IsPaid:{
//     type: Boolean,
//     default: false
//   },
//   IsDeleted: {
//     type: Boolean,
//     default: false
//   },
// }, { timestamps: true });

// const ZStorageFacility = mongoose.model("ZstorageFacility", StorageFacilitySchema);

// module.exports = ZStorageFacility;

