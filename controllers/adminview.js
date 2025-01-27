import express from "express";
import { Event, User } from "../models/Behavoir.js";

const app = express();
app.use(express.json());

export const viewEvent = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching events', error: err.message });
    }};
  
    export const conStatus = async (req, res) => {
      const { ids, isApproved } = req.body;
    
      if (typeof isApproved !== 'boolean') {
        return res.status(400).json({ message: 'Invalid status. isApproved must be true or false.' });
      }
    
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty list of event IDs.' });
      }
    
      try {
        const result = await Event.updateMany(
          { _id: { $in: ids } }, // Match events whose IDs are in the list
          { isApproved } // Update the isApproved field with true or false
        );
    
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'No events found with the provided IDs.' });
        }
    
        const statusMessage = isApproved ? 'approved' : 'unapproved';
    
        res.status(200).json({
          message: `Events updated successfully. ${result.modifiedCount} event(s) marked as "${statusMessage}".`,
        });
      } catch (err) {
        res.status(500).json({ message: 'Error updating events', error: err.message });
      }
    };
    
  
    export const viewUsers = async (req, res) => {
      const { role } = req.query;
    
      if (!['user', 'event_organizer', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }
    
      try {
        const users = await User.find({ role });
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
      }};