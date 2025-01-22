var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserLogsSchema = new Schema({
  Email: {
    type: String,
    required: false
  },
  PhoneNumber:{
    type: String,
    required: false,
  },
  EmailOtp: {
    type: String
  },
  PhoneOtp: {
    type: String
  },
  OtpExpires: {
    type: Date,
  },
  CreatedOn: {
    type: Date,
    required: true
  },
  UpdatedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserLogs', UserLogsSchema);