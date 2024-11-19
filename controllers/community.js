import express from "express";
import { GroupModel } from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());


export const addGroup = async (req, res) => {
    try {
    const { gname,users } = req.body;
      
        const newGroup = new GroupModel({ gname,users });
        const savedGroup = await newGroup.save();
        const groupDetails = {
            id: savedGroup._id,
            gname: savedGroup.gname,
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
          firstName: user.firstName,               //showing only the required details of the users 
          lastName: user.lastName,
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

  export const addGroupUser= async (req, res) => {
    try {
      const groupId = req.body.groupId;
      const newUsers = req.body.users; // Assuming new users are provided in an array
  
      // Find the group by ID
      const group = await GroupModel.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }

      // Check if adding new users would exceed the limit (more efficient)
      const currentUsersCount = group.users.length;
      const totalUsersAfterAdding = currentUsersCount + newUsers.length;
      if (totalUsersAfterAdding > 5) {
        return res.status(400).json({ error: 'Group already has the maximum of 5 users.' });
      }
  
      // Validate and add new users to the group
      const validNewUsers = [];
      for (const newUser of newUsers) {
      
  
        // Check if the email already exists in the group
        const existingUser = group.users.find(user => user.email === newUser.email);
        if (existingUser) {
          continue; // Skip existing users
        }
  
        validNewUsers.push(newUser);
      }
  
      // Add valid new users to the group
      group.users = group.users.concat(validNewUsers);
      await group.save();
      res.status(200).json({ message: group });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  };