const ContactUs = require('../models/Contact');
const {  SendContactMail, SendMail } = require('../utils/SendMail');

const createContact = async (req, res) => {
  try {
    const { Name, Email, Phone, Query } = req.body;

    // // Save to database
    // const newContactUs = new ContactUs({ Name, Email, Phone, Query });
    // await newContactUs.save();

    // Send email to user
    await SendContactMail({
      to: Email,
      subject: 'Thank you for contacting us',
      name: Name,
      query: Query,
    });

    // Send email to company
    await SendContactMail({ to: process.env.EMAIL_USER,subject: 'New Contact Us Query', name: Name, query: Query, });

    res.status(200).send('Query submitted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await ContactUs.findByIdAndDelete(id);

    if (!query) {
      return res.status(404).send('Query not found');
    }

    res.status(200).send('Query deleted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact
};
