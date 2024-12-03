import Order from "../model/orderModel.js";
import nodemailer from 'nodemailer';// Ensure you have your Order model imported

export const createOrder = async (req, res, next) => {
  const { 
    firstname,
    lastname,
    phone,
    email,
    address,
    items,
  } = req.body;

  try {
    // Create the order in the database
    const newOrder = new Order({
      firstname,
      lastname,
      phone,
      email,
      address,
      items,
    });

    await newOrder.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use a custom SMTP server
      auth: {
        user: process.env.EMAIL, // Sender's email address (Owner's email)
        pass: process.env.EMAIL_PASSWORD, // Email password or app password
      },
    });

    // Generate the order items table for the email
    const itemsHtml = items.map((item) => `
      <tr>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>${item.productPrice}</td>
        <td>${item.quantity * item.productPrice}</td>
      </tr>
    `).join("");

    const total = items.reduce((sum, item) => sum + item.quantity * item.productPrice, 0);

    // Email content for the buyer
    const buyerEmailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: email, // Buyer's email address
      subject: "Order Confirmation",
      html: `
        <h1>Order Confirmation</h1>
        <p>Dear ${firstname} ${lastname},</p>
        <p>Thank you for your order! Here are the details:</p>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p><strong>Grand Total:</strong> ${total}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p>We hope to serve you again soon!</p>
      `,
    };

    // Email content for the owner
    const ownerEmailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: process.env.OWNER_EMAIL, // Owner's email address
      subject: "New Order Received",
      html: `
        <h1>New Order Received</h1>
        <p>Dear Admin,</p>
        <p>A new order has been placed. Here are the details:</p>
        <p><strong>Customer Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Customer Phone:</strong> ${phone}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p><strong>Grand Total:</strong> ${total}</p>
      `,
    };

    // Send emails
    await transporter.sendMail(buyerEmailOptions);
    await transporter.sendMail(ownerEmailOptions);

    // Respond to the client
    res.status(201).json({ 
      message: "Order created successfully and emails sent", 
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to create order or send email", 
      details: err,
    });
  }
};


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