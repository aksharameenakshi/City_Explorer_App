import express from "express";
const route = express.Router();
import { Event, User } from "../models/Behavoir.js"; 

route.use = (express);

// Get upcoming events
export const eventRouteUp = async (req, res) => {
  try {
    // Fetch only approved events
    const events = await Event.find({ isApproved: true });
    console.log(events);
    res.status(200).json(events); // Send 200 status for success
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events');
  }
};


export const eventRouteSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (typeof query !== 'string' || query.trim() === '') {
      return res.status(400).send('Invalid search query');
    }

    // Perform a search based on title or description dynamically, only fetching approved events
    const events = await Event.find({
      isApproved: true,
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

    const filter = { isApproved: true }; // Ensure only approved events are shown

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
    const username = req.user.username;
  
    const user = await User.findOne({ username }).populate({
      path: 'wishlist',
      match: { isApproved: true }, 
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
};

// Add or remove event to wishlist
export const eventRouteAdd = async (req, res) => {
  try {
    const username = req.user.username;
    const { add, remove } = req.body; 

    if ((!Array.isArray(add) || add.length === 0) && (!Array.isArray(remove) || remove.length === 0)) {
      return res.status(400).json({ message: "Invalid request. Provide at least one valid event ID to add or remove." });
    }

  
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

  
    let addApprovedEvents = [];
    if (Array.isArray(add) && add.length > 0) {
      const approvedEvents = await Event.find({ _id: { $in: add }, isApproved: true });
      addApprovedEvents = approvedEvents.map(event => event._id.toString());
    }

    if (Array.isArray(remove) && remove.length > 0) {
      user.wishlist = user.wishlist.filter(eventId => !remove.includes(eventId.toString()));
    }

    
    user.wishlist = [...new Set([...user.wishlist.map(id => id.toString()), ...addApprovedEvents])];

    await user.save();

    // Fetch updated wishlist
    const updatedUser = await User.findOne({ username }).populate({
      path: "wishlist",
      match: { isApproved: true },
      select: "title description date location"
    });

    res.json({
      message: "Wishlist updated successfully.",
      wishlist: updatedUser.wishlist
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating wishlist.", error: error.message });
  }
};
