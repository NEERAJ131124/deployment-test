const Region = require("../models/Regions");

// Create a new region
exports.createRegion = async (req, res) => {
  try {
    const { RegionName } = req.body;

    if (!RegionName) {
      return res.status(400).json({ success: false, message: "Region name is required" });
    }

    const existingRegion = await Region.findOne({ RegionName });
    if (existingRegion) {
      return res.status(400).json({ success: false, message: "Region already exists" });
    }

    const newRegion = new Region({
      RegionName,
    });

    await newRegion.save();
    res.status(201).json({ success: true, data: newRegion , message: "Region created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating region", error: error.message });
  }
};

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find({ IsDeleted: false });
    res.status(200).json({ success: true, data: regions, message: "Regions fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching regions", error: error.message });
  }
};

// Get a region by ID
exports.getRegionById = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ success: false, message: "Region ID is required" });
    }
    const region = await Region.findById(req.params.id);
    if (!region || region.IsDeleted) {
      return res.status(404).json({ success: false, message: "Region not found" });
    }
    res.status(200).json({ success: true, data: region, message: "Region fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching region", error: error.message });
  }
};

// Update a region
exports.updateRegion = async (req, res) => {
  try {
    const { RegionName, IsActive } = req.body;

    if(!req.params.id){
      return res.status(400).json({ success: false, message: "Region ID is required" });
    }

    if (!RegionName) {
      return res.status(400).json({ success: false, message: "Region name is required" });
    }

    const region = await Region.findByIdAndUpdate(
      req.params.id,
      { RegionName, IsActive, UpdatedOn: new Date() },
      { new: true }
    );

    if (!region) {
      return res.status(404).json({ success: false, message: "Region not found" });
    }

    res.status(200).json({ success: true, data: region, message: "Region updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating region", error: error.message });
  }
};

// Soft delete a region
exports.deleteRegion = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ success: false, message: "Region ID is required" });
    }
    const regionExists = await Region.findById(req.params.id);
    if (!regionExists) {
      return res.status(404).json({ success: false, message: "Region not found" });
    }

    const region = await Region.findByIdAndUpdate(
      req.params.id,
      { IsDeleted: true, UpdatedOn: new Date() },
      { new: true }
    );

    if (!region) {
      return res.status(404).json({ success: false, message: "Region not found" });
    }

    res.status(200).json({ success: true, message: "Region deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting region", error: error.message });
  }
};
