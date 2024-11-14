// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: ''
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;