const ColdStorageGoods = require('../models/GoodsType');

// Create a new cold storage good
exports.createColdStorageGood = async (req, res) => {
  try {
    const coldStorageGood = new ColdStorageGoods(req.body);
    await coldStorageGood.save();
    res.status(201).json({ success: true, data: coldStorageGood, message: 'Cold storage good created successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating cold storage good.', error: error.message });
  }
};

// Get all cold storage goods
exports.getAllColdStorageGoods = async (req, res) => {
  try {
    const coldStorageGoods = await ColdStorageGoods.find({ IsDeleted: false });
    res.status(200).json({ success: true, data: coldStorageGoods, message: 'Cold storage goods fetched successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cold storage goods.', error: error.message });
  }
};

// Get a single cold storage good by ID
exports.getColdStorageGoodById = async (req, res) => {
  try {
    const coldStorageGood = await ColdStorageGoods.findById(req.params.id);
    if (!coldStorageGood || coldStorageGood.IsDeleted) {
      return res.status(404).json({ success: false, message: 'Cold storage good not found.' });
    }
    res.status(200).json({ success: true, data: coldStorageGood, message: 'Cold storage good fetched successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cold storage good.', error: error.message });
  }
};

// Update a cold storage good by ID
exports.updateColdStorageGoodById = async (req, res) => {
  try {
    const updatedColdStorageGood = await ColdStorageGoods.findByIdAndUpdate(
      req.params.id,
      { ...req.body, UpdatedOn: Date.now() },
      { new: true }
    );
    if (!updatedColdStorageGood) {
      return res.status(404).json({ success: false, message: 'Cold storage good not found.' });
    }
    res.status(200).json({ success: true, data: updatedColdStorageGood, message: 'Cold storage good updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cold storage good.', error: error.message });
  }
};

// Delete a cold storage good by ID (soft delete)
exports.deleteColdStorageGoodById = async (req, res) => {
  try {
    const deletedColdStorageGood = await ColdStorageGoods.findByIdAndUpdate(
      req.params.id,
      { IsDeleted: true, UpdatedOn: Date.now() },
      { new: true }
    );
    if (!deletedColdStorageGood) {
      return res.status(404).json({ success: false, message: 'Cold storage good not found.' });
    }
    res.status(200).json({ success: true, data: deletedColdStorageGood, message: 'Cold storage good deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting cold storage good.', error: error.message });
  }
};
