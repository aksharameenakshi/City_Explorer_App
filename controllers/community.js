import express from "express";
import { GroupModel } from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());



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


  //get all group data
export const allGroup = async (req, res) => {

    GroupModel.find()
    .then((groups) => {
      
      res.status(200).json(groups);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching groups', error });
    });
  };

  //to add user to a existing group [group id , user id]
  export const addGroupUser= async (req, res) => {
    try {
      const groupId = req.body.groupId;
      const newUsers=[{userId:req.body.users}]
  
      const group = await GroupModel.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }

      // Check if adding new users would exceed the limit
      const currentUsersCount = group.users.length;
      const totalUsersAfterAdding = currentUsersCount + newUsers.length;
      if (totalUsersAfterAdding > 5) {
        return res.status(400).json({ error: 'Group already has the maximum of 5 users.' });
      }
  
      // Add valid new users to the group
      group.users = group.users.concat(newUsers);
      await group.save();
      res.status(200).json({ message: group });
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  };

  //to create a group[group name , description,and 1 userid]
  export const group= async(req,res)=>{

    try{
    const  gname  = req.body.gname;
    const description=req.body.description
    const users=[{userId:req.body.users}]

    const group = await GroupModel.findOne({ gname: gname });

    if(!group){
      const newGroup = new GroupModel({ gname,description,users });
      const savedGroup = await newGroup.save();
          if (!savedGroup) {
            console.error('Error saving group. Please check the database connection and retry.');
            return res.status(500).json({ message: 'Error saving group' });
          }
          const groupDetails = {
            id: savedGroup._id, 
            gname:savedGroup.gname ,
            description:savedGroup.description
          };
          res.status(200).json(groupDetails);
    }
    else{
         return res.status(400).json({ error: 'Group already exists.' });
    }
    }
    catch(error){
      res.status(500).json({ error: "Internal server error." });
    }
  }
