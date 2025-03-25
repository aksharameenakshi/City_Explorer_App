import express from "express";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import { Notification, User, Event } from "../models/Behavoir.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// Notify user when they add an approved event to their wishlist
export const eventAdded = async (req, res) => {
  try {
    const { username, eventId } = req.body;

    // Check if event is approved
    const event = await Event.findById(eventId);
    if (!event || !event.isApproved) {
      return res.status(400).json({ message: "Event is not approved" });
    }

    
    const notification = new Notification({
      username,
      eventId,
      message: `You added ${event.eventName} to your wishlist!`,
    });

    await notification.save();

    // Emit real-time notification
    io.emit("notification", { username, notification });

    res.status(200).json({ message: "Event added to wishlist & user notified." });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Notify users when an event in their wishlist is forthcoming
export const sendUpcomingEventNotification = async () => {
  try {
    const upcomingEvents = await Event.find({
      date: { $gte: new Date(), $lt: new Date(Date.now() + 24 * 60 * 60 * 1000) }, // Events in next 24 hours
    });

    for (const event of upcomingEvents) {
      const usersWithEvent = await User.find({ wishlist: event._id });

      for (const user of usersWithEvent) {
        const notification = new Notification({
          username: user.username,
          eventId: event._id,
          message: `Reminder: ${event.eventName} is happening soon!`,
        });

        await notification.save();
        io.emit("notification", { username: user.username, notification });
      }
    }
  } catch (error) {
    console.error("Error sending upcoming event notifications:", error);
  }
};

// Route to fetch notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { username } = req.body;

    const notifications = await Notification.find({ username }).populate("eventId");

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("notification", (data) => {
    const { username, notification } = data;
    io.emit("notification", { username, notification });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Schedule reminder notifications to run every hour
setInterval(sendUpcomingEventNotification, 60 * 60 * 1000); // Every hour

