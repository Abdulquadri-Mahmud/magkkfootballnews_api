import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: true,
    },
    lastname : {
        type: String,
        required: true,
    },
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
    address : {
        type: String,
        required: true,
    },
    city : {
        type: String,
        // required: true,
    },
    state : {
        type: String,
        // required: true,
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