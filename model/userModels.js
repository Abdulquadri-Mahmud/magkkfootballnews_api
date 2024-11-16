import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    phone : {
        type: Number,
        required: true,
        unique: true
    },
    email : {
        unique: true,
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true,
    },
    avatar : {
        type: String,
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: ''
    }
}, {timestamps: true});

const User = mongoose.model('user', userSchema);

export default User;