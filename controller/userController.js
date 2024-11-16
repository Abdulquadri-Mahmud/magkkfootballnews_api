import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../model/userModels.js';
import { errorHandler } from '../utils/utils.js';

export const signup = async (req, res, next) => {
    const {username, phone, email, password, avatar} = req.body;

    try {
        if (password.length <= 7) {
            return next(errorHandler(400, 'Please kindly choose a strong password! max(8)'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({username, phone, email, password: hashedPassword, avatar});

        await newUser.save();

        res.status(201).json('Account has been created succesffully!')

    } catch (error) {
        next(error)
    }
}