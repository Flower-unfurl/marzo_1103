const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marzo_1103';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Kết nối MongoDB thành công');
    })
    .catch((error) => {
        console.error('Lỗi kết nối MongoDB:', error.message);
    });

// Import routes
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');

// Sử dụng routes
app.use('/roles', roleRoutes);
app.use('/users', userRoutes);

// Route mặc định
app.get('/', (req, res) => {
    res.json({
        message: 'API Server đang chạy',
        endpoints: {
            roles: '/roles',
            users: '/users'
        }
    });
});

// Xử lý route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route không tồn tại'
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app;
