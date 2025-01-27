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
      const { updates } = req.body; 
    
      // Validate the updates array
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty updates array.' });
      }
    
      // Validate each update object
      for (const update of updates) {
        if (!update.id || typeof update.isApproved !== 'boolean') {
          return res.status(400).json({
            message: 'Each update must include a valid "id" and "isApproved" value (true or false).',
          });
        }
      }
    
      try {
        // Perform updates for each event individually
        const bulkOperations = updates.map((update) => ({
          updateOne: {
            filter: { _id: update.id },
            update: { isApproved: update.isApproved },
          },
        }));
    
        const result = await Event.bulkWrite(bulkOperations);
    
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'No events found with the provided IDs.' });
        }
    
        res.status(200).json({
          message: `Events updated successfully. ${result.modifiedCount} event(s) were updated.`,
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