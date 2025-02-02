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

export const eventRouteAdd = async (req, res) => {
  try {
    const username = req.user.username;
    const { events } = req.body; // Expecting an array of objects [{ eventId, isFavorite }]

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ message: "Invalid request. Provide at least one event with isFavorite status." });
    }

    
    for (const event of events) {
      if (!event.eventId || typeof event.isFavorite !== "boolean") {
        return res.status(400).json({ message: "Each event must have a valid 'eventId' and 'isFavorite' value (true or false)." });
      }
    }

    // Fetch user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const addIds = events.filter(e => e.isFavorite).map(e => e.eventId);
    const removeIds = events.filter(e => !e.isFavorite).map(e => e.eventId);


    const approvedEvents = await Event.find({
      _id: { $in: [...addIds, ...removeIds] },
      isApproved: true
    });
    const approvedEventIds = approvedEvents.map(event => event._id.toString());

    if (approvedEventIds.length === 0) {
      return res.status(404).json({ message: "No approved events found." });
    }

    if (addIds.length > 0) {
      const validAddIds = approvedEventIds.filter(id => addIds.includes(id));
      user.wishlist = [...new Set([...user.wishlist.map(id => id.toString()), ...validAddIds])];
    }

    if (removeIds.length > 0) {
      const validRemoveIds = approvedEventIds.filter(id => removeIds.includes(id));
      user.wishlist = user.wishlist.filter(eventId => !validRemoveIds.includes(eventId.toString()));
    }

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
