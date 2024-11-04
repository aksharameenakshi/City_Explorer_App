import express from "express";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import http from 'http'; 
import { Notification } from "../models/Behavoir.js";

const app = express();
const server = http.createServer(app); 
const io = new Server(server); 

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/app-backend', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


  export const reminderRoute = async (req, res) => {
    const eventId = req.params.eventId;
    const username = req.body.username;
    const reminderTime = req.body.reminderTime;
  
    const reminder = new Notification({
      username,
      eventId,
      message: 'Reminder: Event is happening soon!'
    });
    await reminder.save();
  
    io.emit('notification', { username: req.body.userName , notification: reminder });
    res.send('Reminder set!');
  }
  
 export const notificationRoute = async (req, res) => {
    const user = req.body;
    const notifications = await Notification.find({username: req.body.userName }).populate('eventId');
    res.json(notifications);
  }
  

  io.on('connection', (socket) => {
    console.log('Client connected');
  
    socket.on('notification', (data) => {
      const username = data.username;
      const notification = data.notification;
      io.to(userId).emit('notification', notification); 
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });