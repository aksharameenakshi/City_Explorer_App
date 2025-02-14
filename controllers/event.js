import express from "express";
import { Event } from "../models/Behavoir.js";

const route = express.Router();
route.use(express.json());

// API FOR ORGANIZERS

// Create a new event

export const addEvents =   async (req, res) => {
    try {
      const newEvent = new Event(req.body);
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all events

    export const allEvents =  async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

    // Delete event by ID
    export const deleteEvent = async (req, res) => {
    const { eventId } = req.body;
    try {
      const result = await Event.findByIdAndDelete(eventId);
      if (!result) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update an event by ID
  export const editEvent = async (req, res) => {
    const { id } = req.params;
    const updatedEventData = req.body; 
  
    try {
      const event = await Event.findById(id);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      if(event.isApproved==true){
        return res.status(404).json({ message: 'Event cannot be edited ' });
      }
      event.eventName = updatedEventData.eventName || event.eventName; 
      event.description = updatedEventData.description || event.description;
      event.startDate = updatedEventData.startDate || event.startDate;
      event.endDate = updatedEventData.endDate || event.endDate;
      event.time = updatedEventData.time || event.time;
      event.location = updatedEventData.location || event.location; 
      event.category=updatedEventData.category||event.category;
      // event.subCategory=updatedEventData.subCategory||event.subCategory;
      event.organizer=updatedEventData.organizer||event.organizer;
  
      await event.save();
  
      res.json(event); 
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
 

export const eventCategoryForOrg = async (req, res) => {
  try {
    const {category,organizer} = req.query; 

    let query = { category: { $regex: category, $options: 'i' }, organizer: { $regex: organizer, $options: 'i'} };

    const events = await Event.find(query);

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for the specified category.' });
    }

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// USER'S APIS //

  // Get events by category for users

export const eventCategoryForUsers = async (req, res) => {
  try {
    const {category} = req.query; 

    let query = { category: { $regex: category, $options: 'i' } };
    query.isApproved = true;
    
    const events = await Event.find(query)

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for the specified category.' });
    }

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

