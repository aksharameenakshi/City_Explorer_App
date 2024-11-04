import express from "express";
import mongoose from "mongoose";
const route = express.Router();
import { Event, User } from "../models/Behavoir.js"; 


route.use = (express);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/app-backend', {strictPopulate: false})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


// Get upcoming events
export const eventRouteUp = async (req, res) => {
  try {
    const events = await Event.find( { } );
    console.log(events);
    res.status(200).json(events); // Send 200 status for success

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events');
  }
}


export const eventRouteSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (typeof query !== 'string' || query.trim() === '') {
      return res.status(400).send('Invalid search query');
    }

    // Perform a search based on title or description dynamically
    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  
        { description: { $regex: query, $options: 'i' } }  
      ]
    });

    if (events.length === 0) {
      return res.status(404).json('No events found');
    }

    res.json(events);  
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching events');
  }
}


// Filter events
export const eventRouteFilter = async (req, res) => {
  try {
    const { date, title, location } = req.body;

    
    const filter = {};

    
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; 
    }

    
    if (location) {
      filter.location = { $regex: location, $options: 'i' }; 
    }

    
    const events = await Event.find(filter);

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error filtering events');
  }
};


// Get my events (wishlist)
export const eventRouteMyevents = async (req, res) => {
  try {
    const username = req.body.user;
  
    
    const user = await User.findOne({ username: req.body.userName }).populate({
      path: 'wishlist',
      select: 'title description' 
    });
  
    if (!user) {
      return res.status(404).send("User not found.");
    }
  
    
    res.json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching wishlist');
  }
}

// Add event to wishlist
export const eventRouteAdd = async (req, res) => {
  try {
    const { username, eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found.");
    }

    await User.updateOne(
      { username },
      { $addToSet: { wishlist: eventId } } 
    );

    const user = await User.findOne({ username }).populate({
      path: 'wishlist',
      select: 'title description date location' 
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.json({
      message: "Event successfully added to wishlist.",
      wishlist: user.wishlist
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding event to wishlist or retrieving wishlist.");
  }
};

    
// Remove event from wishlist
export const eventRouteDelete = async (req, res) => {

    try {
      const username = req.body.user; 
      const { eventId } = req.body; // 
  
      if (!eventId) {
        return res.status(400).send("Event ID is required to remove.");
      }
  
      
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).send("Event not found.");
      }
  
      await User.updateOne(
        { username },
        {
          $pull: {
            wishlist: eventId 
          }
        }
      );
  
      res.send("Event removed from wishlist.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error removing event from wishlist.");
    }
  }