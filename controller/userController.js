import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../model/userModels.js';
import { errorHandler } from '../utils/errorHandler.js';

export const signup = async (req, res, next) => {
    const {firstname,lastname, address, city, state,username, phone, email, password, avatar} = req.body;

    try {
        const validUsername = await User.findOne({username});

        const validEmail = await User.findOne({email});

        const validPhone = await User.findOne({phone});
        
        if (validUsername) {
            return next(errorHandler(404, 'Username has been used by another user!'))
        }
        if (validEmail) {
            return next(errorHandler(404, 'Email has been used by another user!'))
        }
        if (validPhone) {
            return next(errorHandler(404, 'Phone number has been used by another user!'))
        }

        if (password.length <= 7) {
            return next(errorHandler(400, 'Please kindly choose a strong password! max(8)'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({firstname,lastname, address, city, state, username, phone, email, password: hashedPassword, avatar});

        await newUser.save();

        res.status(201).json('Account has been created succesffully!')

    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validate password length
        if (password.length < 8) {
            return next(errorHandler(400, 'Please choose a strong password with at least 8 characters!'));
        }

        // check if email is valid...
        const validEmail = await User.findOne({email});
        // check is email is not valid
        if (!validEmail) {
            return next(errorHandler(404, 'User Not Found!'));
        }

        // check if password is valid
        const validPassword = bcryptjs.compareSync(password, validEmail.password);
        // check is password is not valid
        if (!validPassword) {
            return next(errorHandler(404, 'Wrong Credentials!'));
        }

        const webtoken = jwt.sign({id: validEmail._id}, process.env.JWT_SERVICES);

        const {password: pass, ...rest} = validEmail._doc;

        res.cookie('access_token', webtoken, { httpOnly: true, secure: true}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('Signed Out!');
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    const userID = req.params.id;

    const { username, city, state, phone, email, password, avatar} = req.body;

    try {
        const findUserId = await User.findById(userID);

        
        let userPassword = password;
        
        if (userPassword) {
            userPassword = bcryptjs.hashSync(password, 10);
        }
        
        if (!findUserId) {
            next(errorHandler(404, 'Account Not Found!'));
            return;
        }

        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: {
                username, phone, email,  city, state, userPassword, avatar
            }
        }, {new : true});

        const {password: pass, ...rest} = updateUser._doc;
        
        res.status(200).json(updateUser);
        
    } catch (error) {
        next(error)
    }
}

export const deleteAccount = async (req, res, next) => {
    const getUserParamsID = req.params.id;

    // if (req.user.id !== getUserParamsID) {
    //     return next(errorHandler(401, 'You can only deleted your account!'));
    // }
    const findUser = await User.findById(getUserParamsID);

    try {

        if (!findUser) {
            next(errorHandler(404, 'The Account You are trying to delete is not found'));
            return;
        }

        await User.findByIdAndDelete(getUserParamsID);
        res.clearCookie('access_token');

        res.status(200).json('Account has been deleted!');

    } catch (error) {
        next(error);
    }
}

export const allUsers = async (req, res, next) => {
    
    try {
        const excludePassword = {password : 0};

        const getUsers = await User.find({}, {excludePassword});

        // .sort({createdAt : -1});
        
        res.status(200).json(getUsers);

    } catch (error) {
        next(error)
    }
}

export const singleUser = async (req, res, next) => {
    const id = req.params.id;

    try {

        const getUsers = await User.findById(id);

        if (!getUsers) {
            next(errorHandler(404, 'User not found!'));
            return;
        }
        
        res.status(200).json(getUsers);

    } catch (error) {
        next(error)
    }
}

export const userForgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({email});
    
        if (!user) {
            return next(errorHandler(400, 'User Not Found!'));
        }
        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Set the reset token and its expiry on the user document
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

        await user.save();

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
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
            http://localhost:5173/user/forgot-password/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json('Password reset has been sent your email');

    } catch (error) {
        next(error);
        
    }

}

export const userResetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Find the user with the matching reset token and check if the token has not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(errorHandler(400, 'Password reset token is invalid or has expired'));
        }

        // Hash the new password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Update the user's password and remove the reset token and expiry
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json('Password has been reset successfully');

    } catch (error) {
        next(error)
    }

}
