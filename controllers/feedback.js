import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/Behavoir.js';
import { Feedback } from '../models/Behavoir.js';

const route = express.Router();


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/app-backend', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  route.use(express.json());

  export const feedbackRoute = async (req, res) => {
    const { feedbackText } = req.body;
  
    if (!feedbackText) {
      return res.status(400).json({ message: 'Feedback text is required' });
    }
  
    try {
      
      const { username} = req.body;

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send('User not found');
  }

  
      const feedback = new Feedback({
        user: req.body, 
        feedbackText
      });
  
      await feedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
  
