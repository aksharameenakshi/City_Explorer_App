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
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "accepted" or "rejected".' });
    }
  
    try {
      const event = await Event.findByIdAndUpdate(
        id,
        { status },
        { new: true } 
      );
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json({ message: `Event ${status} successfully`, event });
    } catch (err) {
      res.status(500).json({ message: 'Error updating event', error: err.message });
    }};
  
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