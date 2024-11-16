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
        const admin = await Admin.findOne({email});
    
        if (!admin) {
            return next(errorHandler(400, 'Admin Not Found!'));
        }
        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Set the reset token and its expiry on the user document
        admin.resetPasswordToken = token;
        admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

        await admin.save();

        // send the mail
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
            dkim: {
                domainName: 'http://localhost:5173',
                keySelector: 'default',
                // privateKey: fs.readFileSync('path/to/your/privatekey.pem', 'utf8')
            }
        });

        const mailOptions = {
            to: admin.email,
            from: process.env.EMAIL,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
            http://localhost:5173/admin-login/forgot-password/reset-pssword/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json('Password reset has been sent your email');

    } catch (error) {
        next(error);
        console.log(error);
        
    }

}

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