import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
const route = express.Router();
import { User } from '../models/Behavoir.js';

  
route.use(express.json());


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordOTP = otp;
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

    // Send OTP email
    const mailOptions = {
      to: user.email,
      from: process.env.SMTP_USER,
      subject: 'Password Reset OTP',
      text: `You are receiving this because you (or someone else) have requested a password reset for your account.\n\n` +
            `Your One-Time Password (OTP) for resetting your password is: ${otp}\n\n` +
            `Please enter this OTP to proceed with your password reset. The OTP is valid for 1 hour.\n\n` +
            `If you did not request this, please ignore this email, and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'OTP sent to your Email' });
    });

  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password using OTP
export const resetPassword = async (req, res) => {
  try {
    const { otp, password } = req.body;

    if (!otp || !password) {
      return res.status(400).json({ message: 'OTP and Password are required.' });
    }

    const user = await User.findOne({
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure OTP has not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash and set new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. Please login to continue' });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password.' });
  }
};
