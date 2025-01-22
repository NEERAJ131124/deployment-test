const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Query: { type: String, required: true },
}, { timestamps: true });

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
