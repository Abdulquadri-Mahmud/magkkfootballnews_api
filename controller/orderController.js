import Order from "../model/orderModel.js";
import nodemailer from 'nodemailer';// Ensure you have your Order model imported

import fs from "fs";
import path from "path";

export const createOrder = async (req, res, next) => {
  const { firstname, lastname, phone, email, address, items } = req.body;

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

    // Load the logo and convert it to Base64
    const logoPath = path.join(__dirname, "logo.jpg"); // Adjust the path if necessary
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generate the order items table for the email
    const itemsHtml = items
      .map(
        (item) => `
      <tr style="text-align: center;">
        <td style="padding: 8px;">${item.productName}</td>
        <td style="padding: 8px;">${item.quantity}</td>
        <td style="padding: 8px;">${Number(item.productPrice).toLocaleString()}</td>
        <td style="padding: 8px;">${(item.quantity * item.productPrice).toLocaleString()}</td>
      </tr>
    `
      )
      .join("");

    const total = items.reduce((sum, item) => sum + item.quantity * item.productPrice, 0);

    // Email content for the buyer
    const buyerEmailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Order Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; display: flex; justify-content: center;">
            <img src="https://res.cloudinary.com/dypn7gna0/image/upload/v1733313996/logo_j1064i.png" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
          </div>
          <h1 style="text-align: center; color: #333;">Order Confirmation</h1>
          <p>Dear ${firstname} ${lastname},</p>
          <p>Thank you for your order. Here are the details:</p>
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin-top: 20px; margin-bottom: 20px;">
            <thead style="background-color: #f4f4f4;">
              <tr>
                <th style="padding: 10px;">Product Name</th>
                <th style="padding: 10px;">Quantity</th>
                <th style="padding: 10px;">Price</th>
                <th style="padding: 10px;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p><strong>Grand Total:</strong> ${total.toLocaleString()}</p>
          <p><strong>Delivery Address:</strong> ${address}</p>
          <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL}" style="color: #1a73e8;">${process.env.EMAIL}</a>.</p>
          <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">Thank you for choosing Magkk Football Talk!</p>
        </div>
      `,
    };

    // Email content for the admin/owner (similar structure)
    const ownerEmailOptions = {
      from: process.env.EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: "New Order Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; display: flex; justify-content: center;">
            <img src="https://res.cloudinary.com/dypn7gna0/image/upload/v1733313996/logo_j1064i.png" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
          </div>
          <h1 style="text-align: center; color: #333;">New Order Notification</h1>
          <p>Dear Admin,</p>
          <p>A new order has been placed. Here are the details:</p>
          <p><strong>Customer Name:</strong> ${firstname} ${lastname}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Address:</strong> ${address}</p>
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin-top: 20px; margin-bottom: 20px;">
            <thead style="background-color: #f4f4f4;">
              <tr>
                <th style="padding: 10px;">Product Name</th>
                <th style="padding: 10px;">Quantity</th>
                <th style="padding: 10px;">Price</th>
                <th style="padding: 10px;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p><strong>Grand Total:</strong> ${total.toLocaleString()}</p>
        </div>
      `,
    };

    // Send emails concurrently
    const emailPromises = [
      transporter.sendMail(buyerEmailOptions),
      transporter.sendMail(ownerEmailOptions),
    ];

    await Promise.all(emailPromises);

    // Respond to the client
    res.status(201).json({
      message: "Order created successfully and emails sent",
      order: newOrder,
    });
  } catch (err) {
    console.error("Error creating order or sending email:", err);
    res.status(500).json({
      error: "Failed to create order or send email",
      details: err.message,
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