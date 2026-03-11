const User = require('../schemas/users');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
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

// GET user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id, isDeleted: false }).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User không tồn tại"
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE new user
const createUser = async (req, res) => {
    try {
        const { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;
        
        const newUser = new User({
            username,
            password,
            email,
            fullName,
            avatarUrl,
            status,
            role,
            loginCount
        });
        
        const savedUser = await newUser.save();
        const populatedUser = await User.findById(savedUser._id).populate('role');
        
        res.status(201).json({
            success: true,
            data: populatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { username, password, email, fullName, avatarUrl, status, role, loginCount },
            { new: true, runValidators: true }
        ).populate('role');
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User không tồn tại"
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE user (soft delete)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedUser = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User không tồn tại"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Xóa user thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// POST enable user - chuyển status về true
const enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp email và username"
            });
        }
        
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        ).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Thông tin email hoặc username không chính xác"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Kích hoạt user thành công",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// POST disable user - chuyển status về false
const disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp email và username"
            });
        }
        
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        ).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Thông tin email hoặc username không chính xác"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Vô hiệu hóa user thành công",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    enableUser,
    disableUser
};
