const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /users/enable - Kích hoạt user (chuyển status về true)
router.post('/enable', userController.enableUser);

// POST /users/disable - Vô hiệu hóa user (chuyển status về false)
router.post('/disable', userController.disableUser);

// GET /users - Lấy tất cả users
router.get('/', userController.getAllUsers);

// GET /users/:id - Lấy user theo ID
router.get('/:id', userController.getUserById);

// POST /users - Tạo user mới
router.post('/', userController.createUser);

// PUT /users/:id - Cập nhật user
router.put('/:id', userController.updateUser);

// DELETE /users/:id - Xóa mềm user
router.delete('/:id', userController.deleteUser);

module.exports = router;
