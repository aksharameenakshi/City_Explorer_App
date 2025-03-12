import express from "express";
import { Event, User } from "../models/Behavoir.js";
import moment  from "moment";

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
      const result = events.map(event => formatDateInEvents(event));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

    // Delete event by ID
    export const deleteEvent = async (req, res) => {
    const { eventId } = req.body;
    try {
      const events = await Event.findByIdAndDelete(eventId);
      const result = events
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
      const result = event
      res.json(result);
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

    const result = events.map(event => formatDateInEvents(event));
    res.json(result);
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
    
    const result = events.map(event => formatDateInEvents(event));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get my events (wishlist)
export const eventRouteMyevents = async (req, res) => {
  try {
    const username = req.user.username;
  
    const user = await User.findOne({ username }).populate({
      path: 'wishlist',
      match: { isApproved: true }, 
      select: 'eventName description time date location' 
    });
  
    if (!user) {
      return res.status(404).send("User not found.");
    }
  
    res.json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching wishlist');
  }
};

//Add event to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const username = req.user.username;
    const { eventIds } = req.body; 

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ message: "Provide at least one event ID." });
    }

    // Fetch user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    
    const approvedEvents = await Event.find({
      _id: { $in: eventIds },
      isApproved: true
    });

    if (approvedEvents.length === 0) {
      return res.status(404).json({ message: "No approved events found." });
    }

    const validEventIds = approvedEvents.map(event => event._id.toString());


    user.wishlist = [...new Set([...user.wishlist.map(id => id.toString()), ...validEventIds])];

    await user.save();

    res.json({ message: "Events added to wishlist successfully.", wishlist: user.wishlist });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to wishlist.", error: error.message });
  }
};

//Remove events from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const username = req.user.username;
    const { eventIds } = req.body; 

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ message: "Provide at least one event ID." });
    }

    // Fetch user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const approvedEvents = await Event.find({
      _id: { $in: eventIds },
      isApproved: true
    });

    if (approvedEvents.length === 0) {
      return res.status(404).json({ message: "No approved events found." });
    }

    const validEventIds = approvedEvents.map(event => event._id.toString());

    // Remove valid event IDs from wishlist
    user.wishlist = user.wishlist.filter(eventId => !validEventIds.includes(eventId.toString()));

    await user.save();

    res.json({ message: "Events removed from wishlist successfully.", wishlist: user.wishlist });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing from wishlist.", error: error.message });
  }
};





//converting date format

function formatDateInEvents(event) {
 
  const formattedStartDate = convertToDateOnly(event._doc.startDate); //calling the function to convert the startdate
  const formattedEndDate = convertToDateOnly(event._doc.endDate); //calling the function to convert the enddate
  const result = {
    ...event._doc, //using spread operator => to display only the dates 
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
  
  return result; // Return the modified object
}

function convertToDateOnly(date) {
  if (!date) {  //to check the date is passed
    return null;
  }

  const momentDate = moment(date);
  if (!momentDate.isValid()) { //to check the format is valid
    return null;
  }

  return momentDate.format('YYYY-MM-DD');
}
