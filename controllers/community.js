import express from "express";
import { GroupModel } from "../models/Behavoir.js";
import { User } from "../models/Behavoir.js";

const route = express.Router();
route.use(express.json());



// export const groupById =async (req, res) => {

//     try {
//       const groupId = req.body.groupId;
  
//       // Finding a single group by ID, including the users array
//       const group = await GroupModel.findById(groupId).populate("users");
  
//       if (!group) {
//         return res.status(404).json({ error: "Group not found." });
//       }
  
//       const groupDetails = {        //"groupDetails" as object  
//         id: group._id,
//         groupName: group.groupName,
//         users: group.users.map(user => ({  //"user" as array
//           firstName: user.firstName,               //showing only the required details of the users 
//           lastName: user.lastName,
//           email: user.email
//         }))
//       };
  
//       res.status(200).json(groupDetails);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error." });
//     }
//   };


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


  //to create a group[group name , description,and 1 userid]
  export const group= async(req,res)=>{

    try{

    const userId=req.body.users;
    const  groupName  = req.body.groupName;
    const description=req.body.description
    const users=[{userId:userId}]

    const group = await GroupModel.findOne({ groupName: groupName });

    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(400).json({ error: 'User not Exists ' });
    }

    if(!group){
      const newGroup = new GroupModel({ groupName,description,users });
      const savedGroup = await newGroup.save();
          if (!savedGroup) {
            console.error('Error saving group. Please check the database connection and retry.');
            return res.status(500).json({ message: 'Error saving group' });
          }
          const groupDetails = {
            id: savedGroup._id, 
            groupName:savedGroup.groupName ,
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

  
 // delete group 
export const deleteGroup= async(req,res)=>{

  try {
    const  groupId  = req.body.groupId;
   const group = await GroupModel.findByIdAndDelete(groupId);
   res.status(200).json(group);
   

  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Server Error' })}
}




  //to add user to a existing group [group id , user id]
  export const addGroupUser= async (req, res) => {
    try {
      const userId=req.body.userId
      const groupId = req.body.groupId;
      const newUsers=[{userId:userId}]
  
      const group = await GroupModel.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }

      //  Find the user by username
  const user = await User.findOne({ username: userId });
  if (!user) {
    return res.status(400).json({ error: 'User not Exists ' });

  }

  const isUserInGroup = group.users.some(user => user.userId === userId);

  if (isUserInGroup) {
    return res.status(400).json({ error: 'User is already in the group ' });

  }

      // Check if adding new users would exceed the limit
      const currentUsersCount = group.users.length;
      const totalUsersAfterAdding = currentUsersCount + newUsers.length;
      if (totalUsersAfterAdding > 5) {
        return res.status(400).json({ error: 'Group already has the maximum of 5 users.' });
      }
  
      group.users.push(...newUsers);
      const savedGroup = await group.save();
      if (!savedGroup) {
        console.error('Error saving group. Please check the database connection and retry.');
        return res.status(500).json({ message: 'Error saving group' });
      }
      const groupDetails = {
        groupName:savedGroup.groupName ,
        description:savedGroup.description
      };
      res.status(200).json(groupDetails);
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  };


  // removing user from group

  export const removeUserFromGroup =async(req,res)=>{
  try {
    const userId=req.body.usersId;
    const  groupName  = req.body.groupName;
    const group = await GroupModel.findOne({ groupName });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Find the user index in the users array
    const userIndex = group.users.findIndex(user => user.userId === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in group' });
    }

    // Remove the user from the array
    group.users.splice(userIndex, 1);

    // Save the updated group
    await group.save();

    res.json({ message: 'User removed from group successfully' });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
  }




  
 