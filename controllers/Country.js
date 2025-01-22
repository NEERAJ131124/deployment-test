const Country = require("../models/Country");

// Create a new country
exports.createCountry = async (req, res) => {
  try {
    const { CountryName, ISOCode } = req.body;
    if(!CountryName || !ISOCode){
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    // Check if country already exists
    const existingCountry = await Country.findOne({ CountryName, IsDeleted: false });
    if (existingCountry) {
      return res.status(400).json({ success: false, message: "Country already exists" });
    }
    const newCountry = new Country({
      CountryName,
      ISOCode,
    });
    await newCountry.save();
    res.status(201).json({ success: true, data: newCountry, message: "Country created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating country", error: error.message });
  }
};

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find({ IsDeleted: false });
    res.status(200).json({ success: true, data: countries, message: "Countries fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching countries", error: error.message });
  }
};

// Get a country by ID
exports.getCountryById = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ success: false, message: "Country ID is required" });
    }
    const country = await Country.findById(req.params.id);
    if (!country || country.IsDeleted) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.status(200).json({ success: true, data: country, message: "Country fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching country", error: error.message });
  }
};

// Update a country
exports.updateCountry = async (req, res) => {
  try {
    const { CountryName, ISOCode, IsActive } = req.body;

    if(!req.params.id){
      return res.status(400).json({ success: false, message: "Country ID is required" });
    }

    if (!CountryName || !ISOCode) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      { CountryName, ISOCode, IsActive, UpdatedOn: new Date() },
      { new: true }
    );
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.status(200).json({ success: true, data: country, message: "Country updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating country", error: error.message });
  }
};

// Soft delete a country
exports.deleteCountry = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ success: false, message: "Country ID is required" });
    }
    const countryExists = await Country.findById(req.params.id);
    if (!countryExists) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      { IsDeleted: true, UpdatedOn: new Date() },
      { new: true }
    );
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.status(200).json({ success: true, message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting country", error: error.message });
  }
};
