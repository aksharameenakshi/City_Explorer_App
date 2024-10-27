import express from "express";
import mongoose from "mongoose";
import ProfileSettingsModel  from "../model/ProfileSettings.js";
const route = express.Router();
route.use(express.json());

mongoose.connect('mongodb://localhost:27017/college')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


export const profileSettings =  async (req, res) => {
    try {
    const { fname,lname,email,phn_number } = req.body;
      
        const userProfile = new ProfileSettingsModel({ fname,lname,email,phn_number });
        const savedProfile = await userProfile.save(); //data saved to db
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProfileSettings =async (req, res) => {
    try {
      // Access email from request query parameters
      const email = req.body.email;
      // Validate email
      if (!email) {
        return res.status(400).json({ error: "Invalid email provided" });
      }
  
      // Find profile settings by email using Mongoose findOne()
      const data = await ProfileSettingsModel.findOne({email});
  
      if (data) {
        res.json(data);
      } else {
        res.status(404).json("No Records found");
      }
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: "Internal Server Error" });
    }
  }