let mongoose = require('mongoose');

let rolesSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên role không được để trống"],
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('role', rolesSchema);
