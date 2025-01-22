const State = require("../models/States");
const Country = require("../models/Country");

// Create a new state
exports.createState = async (req, res) => {
  try {
    const { StateName, CountryID } = req.body;
    if(!StateName || !CountryID){
      return res.status(400).json({ success: false, message: "Please ensure all required fields are provided." });
    }
    // Check if the country exists
    const countryExists = await Country.findById(CountryID);
    if (!countryExists) {
      return res.status(404).json({ success: false, message: "The specified country could not be found." });
    }

    // Check if the state already exists
    const stateExists = await State.findOne({ StateName, CountryID });
    if (stateExists) {
      return res.status(400).json({ success: false, message: "The specified state already exists." });
    }

    const newState = new State({
      StateName,
      CountryID,
    });

    await newState.save();
    res.status(201).json({ success: true, data: newState, message: "The state has been successfully created." });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while creating the state.", error: error.message });
  }
};

// Get all states
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find({ IsDeleted: false }).populate("CountryID", "CountryName");
    res.status(200).json({ success: true, data: states, message: "The states have been successfully fetched." });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while fetching the states.", error: error.message });
  }
};

// Get a state by ID
exports.getStateById = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ success: false, message: "The State ID is required to proceed." });
    }
    const state = await State.findById(req.params.id).populate("CountryID", "CountryName");
    if (!state || state.IsDeleted) {
      return res.status(404).json({ success: false, message: "The specified state could not be found." });
    }
    res.status(200).json({ success: true, data: state, message: "The state has been successfully fetched." });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while fetching the state.", error: error.message });
  }
};

// Update a state
exports.updateState = async (req, res) => {
  try {
    const { StateName, CountryID, IsActive } = req.body;

    if(!req.params.id){
      return res.status(400).json({ success: false, message: "The State ID is required to proceed." });
    } 

    if(!StateName || !CountryID){
      return res.status(400).json({ success: false, message: "Please ensure all required fields are provided." });
    }
    // Check if the country exists
    if (CountryID) {
      const countryExists = await Country.findById(CountryID);
      if (!countryExists) {
        return res.status(404).json({ success: false, message: "The specified country could not be found." });
      }
    }

    const state = await State.findByIdAndUpdate(
      req.params.id,
      { StateName, CountryID, IsActive, UpdatedOn: new Date() },
      { new: true }
    );

    if (!state) {
      return res.status(404).json({ success: false, message: "The specified state could not be found." });
    }

    res.status(200).json({ success: true, data: state, message: "The state has been successfully updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while updating the state.", error: error.message });
  }
};

// Soft delete a state
exports.deleteState = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ success: false, message: "The State ID is required to proceed." });
    }
    const stateExists = await State.findById(req.params.id);
    if (!stateExists) {
      return res.status(404).json({ success: false, message: "The specified state could not be found." });
    }

    const state = await State.findByIdAndUpdate(
      req.params.id,
      { IsDeleted: true, UpdatedOn: new Date() },
      { new: true }
    );

    if (!state) {
      return res.status(404).json({ success: false, message: "The specified state could not be found." });
    }

    res.status(200).json({ success: true, message: "The state has been successfully deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while deleting the state.", error: error.message });
  }
};

// Get all states by CountryID with IsDeleted set to false
exports.getStatesByCountryId = async (req, res) => {
  try {
    const  CountryID  = req.params.id;
    // Check if the CountryID is provided
    if (!CountryID) {
      return res.status(400).json({ success: false, message: "The Country ID is required to proceed." });
    }

    // Check if the country exists
    const countryExists = await Country.findById(CountryID);
    if (!countryExists) {
      return res.status(404).json({ success: false, message: "The specified country could not be found." });
    }

    // Fetch states for the given CountryID where IsDeleted is false
    const states = await State.find({ CountryID, IsDeleted: false })
    // .populate("CountryID", "CountryName");

    // Check if there are any states for the given country
    if (states.length === 0) {
      return res.status(404).json({ success: false, message: "No states found for the specified country." });
    }

    res.status(200).json({ success: true, data: states, message: "The states have been successfully fetched." });

  } catch (error) {
    // Catching any unexpected errors
    res.status(500).json({ success: false, message: "An error occurred while fetching the states.", error: error.message });
  }
};

