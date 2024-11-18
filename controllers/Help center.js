import express from 'express';
import nodemailer from 'nodemailer';
import { Report } from '../models/Behavoir.js';
import { User } from '../models/Behavoir.js';

const route = express.Router();

  route.use(express.json());


  // Route to create a report
export const reportRoute = async (req, res) => {
  const { message, username } = req.body;

  if (!message) {
      return res.status(400).json({ message: 'Message is required' });
  }
  if (!username) {
      return res.status(400).json({ message: 'Username is required' });
  }

  try {
      // Save the report in the database
      const report = new Report({
          user: req.body,
          message,
          status: 'Pending', 
      });

      await report.save();

      // Configure Nodemailer transporter
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

      // Send email notification to the admin
      const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New Report from User ${username}`,
          text: `Username: ${username}\n\nMessage:\n${message}`,
      };

      transporter.sendMail(mailOptions, (error) => {
          if (error) {
              console.error('Error sending email:', error);
              return res.status(500).json({ message: 'Failed to send email to admin' });
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

  if (!reportId || !reply) {
      return res.status(400).json({ message: 'Report ID and reply are required' });
  }

  try {
      // Find the report by ID
      const report = await Report.findById(reportId);
      if (!report) {
          return res.status(404).json({ message: 'Report not found' });
      }

      
      report.reply = reply;
      report.status = 'Replied';
      await report.save();

      const { username} = req.body;
      const user = await User.findOne({ username});
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Configure Nodemailer transporter
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

      // Notify the user about the admin's reply
      const mailOptions = {
          from: process.env.SMTP_USER,
          to: user.email,
          subject: 'Admin Reply to Your Report',
          text: `Hello ${user.username},\n\nThe admin has replied to your report:\n\n${reply}\n\nBest regards,\nSupport Team`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Reply sent and user notified successfully' });
  } catch (error) {
      console.error('Error in adminReplyRoute:', error);
      res.status(500).json({ message: 'Server error' });
  }
};
