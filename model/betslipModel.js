import mongoose from "mongoose";

var betslipSchema = new mongoose.Schema({
    betslipCode : {
        type: String,
        required: true,
    },
    category : {
        type: String,
        required: true,
    },
    date : {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Betslip = mongoose.model('betslip', betslipSchema);

export default Betslip;