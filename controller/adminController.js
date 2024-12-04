import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { errorHandler } from '../utils/errorHandler.js';
import Admin from '../model/adminModel.js';

export const adminSignup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const findAdmin = await Admin.findOne({ email });

        if (findAdmin) {
            return next(errorHandler(404, 'Admin already exist'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newAdmin = new Admin({
            username, email, password: hashedPassword
        });

        await newAdmin.save();

        res.status(201).json('Admin Registered!');

    } catch (error) {
        next(error);
    }
}

export const deleteAccount = async (req, res, next) => {
    const getAdminParamsID = req.params.id;

    // if (req.user.id !== getUserParamsID) {
    //     return next(errorHandler(401, 'You can only deleted your account!'));
    // }
    const findAdmin = await Admin.findById(getAdminParamsID);

    try {

        if (!findAdmin) {
            next(errorHandler(404, 'The Account You are trying to delete is not found'));
            return;
        }

        await Admin.findByIdAndDelete(getAdminParamsID);
        res.clearCookie('access_token');

        res.status(200).json('Account has been deleted!');

    } catch (error) {
        next(error);
    }
}

export const allAdmin = async (req, res, next) => {
    
    try {
        const excludePassword = {password : 0};

        const getAdmin = await Admin.find({}, {excludePassword});

        // .sort({createdAt : -1});
        
        res.status(200).json(getAdmin);

    } catch (error) {
        next(error)
    }
}

// Admin login route
export const AdminLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if the admin user exists
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return next(errorHandler(400, 'Admin Not Found'))
        }

        // Verify the password
        const isMatch = bcryptjs.compareSync(password, admin.password);

        if (!isMatch) {
            return next(errorHandler(400, 'Wrong credentials'))
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.Admin_JWT_SECRETE,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return next(errorHandler(400, 'Admin Not Found!'));
      }
  
      // Generate a reset token
      const token = crypto.randomBytes(20).toString('hex');
  
      // Set the reset token and its expiry on the admin document
      admin.resetPasswordToken = token;
      admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  
      await admin.save();
  
      // Configure the mail transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      // Define the email options
      const mailOptions = {
        to: admin.email,
        from: process.env.EMAIL,
        subject: 'Reset Your Password - Admin Portal',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dypn7gna0/image/upload/v1733302422/xplbuyneujqysopef2i2.jpg" alt="Magkk Football Talk Logo" style="width: 100px; height: auto;">
            </div>
            <h2 style="text-align: center; color: #4CAF50;">Password Reset Request</h2>
            <p>Hi <strong>${admin.name || 'Admin'}</strong>,</p>
            <p>We received a request to reset your password for the Admin Portal account associated with this email address.</p>
            <p>If you made this request, click the button below to reset your password. This link will expire in 1 hour.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="http://localhost:5173/admin-login/forgot-password/reset-password/${token}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
            </div>
            <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
            <p style="word-wrap: break-word;">
              <a href="http://localhost:5173/admin-login/forgot-password/reset-password/${token}" style="color: #4CAF50;">http://localhost:5173/admin-login/forgot-password/reset-password/${token}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p>If you did not request a password reset, you can safely ignore this email. Rest assured, your account is safe.</p>
            <p>Best regards,</p>
            <p><strong>Admin Portal Support Team</strong></p>
            <footer style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">
              &copy; ${new Date().getFullYear()} Admin Portal. All rights reserved.
            </footer>
          </div>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json('A password reset email has been sent to your email address.');
    } catch (error) {
      next(error);
      console.log(error);
    }
};
  

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Find the user with the matching reset token and check if the token has not expired
        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return next(errorHandler(400, 'Password reset token is invalid or has expired'));
        }

        // Hash the new password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Update the admin's password and remove the reset token and expiry
        admin.password = hashedPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;

        await admin.save();

        res.status(200).json('Password has been reset successfully');

    } catch (error) {
        next(error)
    }

}