import express from "express";
import { Messages } from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());


export const addMessges= async(req,res)=>{
    try{

        const{groupId,userId,content}=req.body
        const message = new Messages({ content, author: userId, group: groupId });
        await message.save();
        res.status(201).json("Message sent..");
    }
    catch{
        console.error(error);
        return res.status(500).json({ error: "Internal server error." }); 
    }
}

export const getMessageById = async (req, res) => {
  try {
    const  messageId  = req.body.messageId;

    const message = await Messages.findById(messageId).populate('author group');  // Optional populate for references

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages 
   export const getAllMessages= async (req, res) => {
  try {
    // Fetch all messages from the database
    const messages = await Messages.find().populate('author group'); // Optionally, populate the author and group fields

    // Return the list of messages in the response
    res.status(200).json(messages);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ error: error.message });
  }
};

// delete
export const deleteMessage= async (req, res) => {
    try {
      const messageId=req.body.messageId
      const message = await Messages.findByIdAndDelete(messageId);   
  
      if (!message) {
        return res.status(404).json({   
   message: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Edit a message
   export const editMessage=  async (req, res) => {
    try {
      const { messageId, content } = req.body;
      const message = await Messages.findByIdAndUpdate(
       messageId,
        {content},
        { new: true }
      );
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
