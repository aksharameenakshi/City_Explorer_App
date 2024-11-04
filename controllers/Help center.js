import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { Report } from '../models/Behavoir.js';
import { User } from '../models/Behavoir.js';

const route = express.Router();


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/app-backend', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  route.use(express.json());


  export const reportRoute = async (req, res) => {
    const { message, username } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    } 
        
    if (!username) {({ username: req.body.userName }) 
        return res.status(400).json({ message: 'Username is required' });
    }

    try {

        
        const report = new Report({
            username:req.body.userName,
            message,
        });

        await report.save();

        
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

        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Report from User ${username}`,
            text: `Username: ${username}\n\nMessage:\n${message}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send email' });
            }
            res.status(200).json({ message: 'Report sent successfully' });
        });
    } catch (error) {
        console.error("Error in /report route:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const adminReplyRoute = async (req, res) => {
    const { reportId, reply } = req.body;
  
    if (!reply) {
      return res.status(400).json({ message: 'Reply is required' });
    }
  
    try {
      
      const report = await Report.findByIdAndUpdate(
        reportId,
        { reply, repliedAt: Date.now() },
        { new: true }
      );
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      res.status(200).json({ message: 'Reply sent successfully', report });
  
    } catch (error) {
      console.error("Error in adminReplyRoute:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };


export const sendEmailNotification = async (username, reply) => {
  const user = await User.findOne(username);
  if (!user) throw new Error('User not found');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Admin Reply to Your Report',
    text: `Hello ${user.username},\n\nThe admin has replied to your report:\n\n${reply}\n\nBest regards,\nSupport Team`,
  };

  await transporter.sendMail(mailOptions);
};

