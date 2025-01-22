const Role = require("../models/Roles");

// Create a new Role
exports.createRole = async (req, res) => {
  try {
    const { RoleName, Description } = req.body;

    const newRole = new Role({
      RoleName,
      Description,
    });

    await newRole.save();
    res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating role.", error: error.message });
  }
};

// Get all Roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching roles.", error: error.message });
  }
};

// Get a Role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching role.", error: error.message });
  }
};

// Update a Role
exports.updateRole = async (req, res) => {
  try {
    const { RoleName, Description } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { RoleName, Description, UpdatedOn: Date.now() },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }

    res.status(200).json({ success: true, data: updatedRole });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating role.", error: error.message });
  }
};

// Delete a Role
exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);

    if (!deletedRole) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }

    res.status(200).json({ success: true, message: "Role deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting role.", error: error.message });
  }
};
