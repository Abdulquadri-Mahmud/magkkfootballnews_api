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

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        if (password.length <= 7) {
            return next(errorHandler(400, 'Please kindly choose a strong password! max(8)'));
        }

        const verifyEmail = await User.findOne({email});

        if (!verifyEmail) {
            return next(errorHandler(404, 'User Not Found!'));
        }

        const validPassword = bcryptjs.compareSync(password, verifyEmail.password);

        if (!validPassword) {
            return next(errorHandler(404, 'Wrong Credentials!'));
        }

        const webtoken = jwt.sign({id: verifyEmail._id}, process.env.JWT_SERVICES);

        const { password: pass, ...rest } = verifyEmail._doc;

        res.cookie('access_token', webtoken, {httpOnly: true}).status(200).json(rest);

    } catch (error) {
        next(error);
    }
}