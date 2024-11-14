import mongoose from "mongoose";

var betslipSchema = new mongoose.Schema({
    betcode: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: [],
        required: true
    },
    description: {
        type: String,
        required: true
    },

}, {timestamps: true});

const Betslip = mongoose.model('betslip', betslipSchema);

export default Betslip;