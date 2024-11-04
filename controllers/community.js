import express from "express";
import mongoose from "mongoose";
import { GroupModel } from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());


mongoose.connect('mongodb://localhost:27017/app-backend')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

export const addGroup = async (req, res) => {
    try {
    const { gname,users } = req.body;
      
        const newGroup = new GroupModel({ gname,users });
        const savedGroup = await newGroup.save();
        const groupDetails = {
            id: savedGroup._id,
            gname: savedGroup.gname,
            users:savedGroup.users[{
                fname:String,
                lname:String,
                email:String,
                phn_number:Number
            }]
        
          };
          res.status(201).json(groupDetails);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error." }); 
        }
};

export const groupById =async (req, res) => {
    try {
      const groupId = req.body.groupId;
  
      // Finding a single group by ID, including the users array
      const group = await GroupModel.findById(groupId).populate("users");
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }
  
      const groupDetails = {        //"groupDetails" as object  
        id: group._id,
        gname: group.gname,
        users: group.users.map(user => ({  //"user" as array
          fname: user.fname,               //showing only the required details of the users 
          lname: user.lname,
          email: user.email
        }))
      };
  
      res.status(200).json(groupDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

export const allGroup = async (req, res) => {

    GroupModel.find()
    .then((groups) => {
      
      res.status(200).json(groups);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching groups', error });
    });
  };