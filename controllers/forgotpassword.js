import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'; 
import crypto from 'crypto';
const route = express.Router();
import { User } from '../models/Behavoir.js';



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/app-backend', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  route.use(express.json());

  export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 10000, 
        });
        

        // Send email
        const mailOptions = {
            to: user.email,
            from: process.env.SMTP_USER,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                  `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                  `http://localhost:2024/reset-password/${token}\n\n` +
                  `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
        
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    console.log('Request body:', req.body);


    if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
    }

    
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
    });

   
    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    try {
        
        const hashedPassword = await bcrypt.hash(password, 10); 

        
        user.password = hashedPassword; 

       
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully. Please login to continue' });
        //res.redirect('/login');
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ message: 'Error resetting password.' });
    }
    

}

