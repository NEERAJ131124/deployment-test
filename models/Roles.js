const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  RoleName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  Description: {
    type: String,
    maxlength: 500,
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
  UpdatedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", roleSchema);
