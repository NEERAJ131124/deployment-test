const StorageType = require("../models/StorageType");

// Create StorageType along with StorageCapacity
exports.createStorageType = async (req, res) => {
  try {
    const { Type } = req.body;
    // if no type is provided
    if (!Type) {
      return res.status(400).json({ message: "Storage Type is required." });
    }

    // check if the type already exists
    const existingType = await StorageType.findOne({ Type });
    if (existingType) {
      return res.status(400).json({ message: "Storage Type already exists." });
    }
    const storageType = new StorageType({Type,CreatedOn: new Date()});
    await storageType.save(); // Save StorageType

    res.status(201).json({message: "Storage Type created successfully",storageType});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error",error: error.response });
  }
};

// Get all StorageTypes along with StorageCapacity details
exports.getAllStorageTypes = async (req, res) => {
  try {
    const storageTypes = await StorageType.find();
    res.status(200).json({success: true,data: storageTypes,message: "Storage Types fetched successfully"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error",error: error.response });
  }
};

// Get a specific StorageType with its StorageCapacity
exports.getStorageTypeById = async (req, res) => {
  try {
    const storageType = await StorageType.findById(req.params.id);

    if (!storageType) {
      return res.status(404).json({ msg: "Storage Type not found." });
    }

    res.status(200).json({
      success: true,
      data: storageType,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Update a specific StorageType and its associated StorageCapacity
exports.updateStorageType = async (req, res) => {
  try {
    const { Type } = req.body;
    // if no id is provided
    if (!req.params.id) {
      return res.status(400).json({ message: "Storage Type ID is required." });
    }
    // if no type is provided
    if (!Type) {
      return res.status(400).json({ message: "Storage Type is required." });
    }
    // Find and update the StorageType
    const storageType = await StorageType.findById(req.params.id);
    if (!storageType) {
      return res.status(404).json({ message: "Storage Type not found." });
    }

    storageType.Type = Type;
    await storageType.save();

    res.status(200).json({message: "Storage Type updated successfully.",storageType});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error",error: error.response });
  }
};

// Delete a specific StorageType and its related StorageCapacity
exports.deleteStorageType = async (req, res) => {
  try {
    const storageType = await StorageType.findById(req.params.id);
    if (!storageType) {
      return res.status(404).json({ message: "Storage Type not found." });
    }

    await StorageType.findByIdAndDelete(req.params.id);

    res.status(200).json({message: "Storage Type deleted successfully."});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error",error: error.response });
  }
};
