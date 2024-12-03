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
    // Email content for the buyer
const buyerEmailOptions = {
  from: process.env.EMAIL, // Sender's email address
  to: email, // Buyer's email address
  subject: "Order Confirmation",
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <header style="background-color: #4CAF50; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Thank You for Your Order!</h1>
        </header>
        <div style="padding: 20px;">
          <p>Dear <strong>${firstname} ${lastname}</strong>,</p>
          <p>We are thrilled to confirm your order. Below are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Product Name</th>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Quantity</th>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Price</th>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${item.productPrice.toLocaleString()}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${(item.quantity * item.productPrice).toLocaleString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <p style="font-size: 16px;"><strong>Grand Total:</strong> ${total.toLocaleString()}</p>
          <p style="font-size: 16px;"><strong>Delivery Address:</strong> ${address}</p>
          <p style="margin-top: 20px;">If you have any questions about your order, feel free to contact us at <a href="mailto:support@example.com" style="color: #4CAF50;">support@example.com</a>.</p>
        </div>
        <footer style="background-color: #f4f4f4; color: #666; text-align: center; padding: 10px;">
          <p style="margin: 0;">&copy; 2024 MAGKKFOOTBALLTALK. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  `,
};


    const ownerEmailOptions = {
      from: process.env.EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: "New Order Received",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <header style="background-color: #2196F3; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">New Order Notification</h1>
            </header>
            <div style="padding: 20px;">
              <p>Dear Admin,</p>
              <p>A new order has been placed. Below are the details:</p>
              <p><strong>Customer Name:</strong> ${firstname} ${lastname}</p>
              <p><strong>Customer Phone:</strong> ${phone}</p>
              <p><strong>Customer Email:</strong> ${email}</p>
              <p><strong>Delivery Address:</strong> ${address}</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Product Name</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Quantity</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Price</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item) => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${item.productPrice.toLocaleString()}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${(item.quantity * item.productPrice).toLocaleString()}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <p style="font-size: 16px;"><strong>Grand Total:</strong> ${total.toLocaleString()}</p>
            </div>
            <footer style="background-color: #f4f4f4; color: #666; text-align: center; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 2024 MAGKKFOOTBALLTALK. All Rights Reserved.</p>
            </footer>
          </div>
        </div>
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