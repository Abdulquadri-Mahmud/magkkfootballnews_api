import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { errorHandler } from '../utils/errorHandler.js';
import Admin from '../model/adminModel.js';

export const adminSignup = async (req, res, next) => {
    const {username, email, password} = req.body;

    try {
        if (password.length >= 7) {
            return next(errorHandler)
        }
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