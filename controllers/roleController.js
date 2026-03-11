const Role = require('../schemas/roles');
const User = require('../schemas/users');

// GET all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET role by ID
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findOne({ _id: id, isDeleted: false });
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role không tồn tại"
            });
        }
        
        res.status(200).json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE new role
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const newRole = new Role({
            name,
            description
        });
        
        const savedRole = await newRole.save();
        res.status(201).json({
            success: true,
            data: savedRole
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE role
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const updatedRole = await Role.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { name, description },
            { new: true, runValidators: true }
        );
        
        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: "Role không tồn tại"
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedRole
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE role (soft delete)
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedRole = await Role.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        
        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: "Role không tồn tại"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Xóa role thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET all users by role ID
const getUsersByRoleId = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra role có tồn tại không
        const role = await Role.findOne({ _id: id, isDeleted: false });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role không tồn tại"
            });
        }
        
        const users = await User.find({ role: id, isDeleted: false }).populate('role');
        
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    getUsersByRoleId
};
