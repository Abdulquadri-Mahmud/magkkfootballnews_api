import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  totalPayment: { type: Number, required: true },
  status: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
