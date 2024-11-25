import mongoose from "mongoose";

var checkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
}, {timestamps : true});

const Checkout = mongoose.model('checkout', checkoutSchema);

export default Checkout;