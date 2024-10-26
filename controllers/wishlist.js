import express from "express";
import mongoose from "mongoose";
const route = express.Router();
import session from 'express-session';
import { Event, User } from "../models/Behavoir.js"; 



route.use(session({
  secret: 'DND4U',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } 
}));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/app-backend', {})
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
//export const eventRouteFilter = async (req, res) => {
 // try {
   // const { date } = req.body;

    //const startOfDay = new Date(date);
    //const endOfDay = new Date(startOfDay);
    //endOfDay.setHours(23, 59, 59, 999); 

    //const events = await Event.find({
      //date: {
        //$gte: startOfDay,
        //$lte: endOfDay,
     // },
  //  });

    //return res.status(200).json(events);
  //} catch (error) {
   // console.error(error);
   // return res.status(500).send('Error filtering events');
 // }
//};

// Get my events (wishlist)
export const eventRouteMyevents = async (req, res) => {
  try {
    const userName = req.body.userName; // Requires authentication middleware 
    const user = await User.findById(userName).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching wishlist');
  }
}

// Add event to wishlist
export const eventRouteAdd = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userName = req.body.userName; // Requires authentication middleware
    const user = await User.findById(userName);
    user.wishlist.push(eventId);
    await user.save();
    res.send('Event added to wishlist!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding event to wishlist');
  }
}

// Remove event from wishlist
export const eventRouteDelete = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userName = req.body.userName; 
    const user = await User.findById(userName);
    user.wishlist.pull(eventId);
    await user.save();
    res.send('Event removed from wishlist!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error removing event from wishlist');
  }
}
