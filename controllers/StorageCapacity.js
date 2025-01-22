const StorageCapacity = require("../models/StorageCapacity");

exports.getAllCapacities = async (req, res) => {
  try {
    const capacities = await StorageCapacity.find();
    res.status(200).json(capacities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCapacityById = async (req, res) => {
  try {
    const capacity = await StorageCapacity.findById(req.params.id);
    if (!capacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }
    res.status(200).json(capacity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCapacity = async (req, res) => {
  console.log("adding capacity:----,", req.body);
  const capacity = new StorageCapacity(req.body);
  try {
    const savedCapacity = await capacity.save();
    console.log("saved capacity: ", savedCapacity);
    res.status(201).json(savedCapacity);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCapacity = async (req, res) => {
  try {
    const updatedCapacity = await StorageCapacity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCapacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }
    res.status(200).json(updatedCapacity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCapacity = async (req, res) => {
  try {
    const deletedCapacity = await StorageCapacity.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCapacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }
    res.status(200).json({ message: "Capacity deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
