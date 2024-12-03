import Order from "../model/orderModel.js";

export const createOrder = async (req, res, next) => {
    const { 
      orderId,
        firstname,
        lastname,
        phone,
        email,
        address,
        // totalPayment,
        // status,
        items,
     } = req.body;
     
    try {
    const newOrder = new Order({
        orderId,
        firstname,
        lastname,
        phone,
        email,
        address,
        // totalPayment,
        // status,
        items,
    });
        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create order', details: err });
    }
}

export const OrderID = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json(order);
      } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve order', details: err });
      }
}

// update order by id
export const updateOrder = async (req, res, next) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
      } catch (err) {
        res.status(500).json({ error: 'Failed to update order', details: err });
      }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to delete order', details: err });
      }
}

export const allOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();

        res.status(200).json(orders);

      } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve orders', details: err });
      }
}