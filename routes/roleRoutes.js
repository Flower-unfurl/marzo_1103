const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET /roles - Lấy tất cả roles
router.get('/', roleController.getAllRoles);

// POST /roles - Tạo role mới
router.post('/', roleController.createRole);

// GET /roles/:id/users - Lấy tất cả users có role là id
router.get('/:id/users', roleController.getUsersByRoleId);

// GET /roles/:id - Lấy role theo ID
router.get('/:id', roleController.getRoleById);

// PUT /roles/:id - Cập nhật role
router.put('/:id', roleController.updateRole);

// DELETE /roles/:id - Xóa mềm role
router.delete('/:id', roleController.deleteRole);

module.exports = router;
