import express from "express";
import { User } from "../models/Behavoir.js";
//import { ProfileSettingsModel } from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());


export const profileSettings = async (req, res) => {
    const { username } = req.body;
    const { firstName, lastName, email, phoneNumber } = req.body;
  
    try {
      if (!firstName && !lastName && !email && !phoneNumber) {
        return res
          .status(400)
          .json({ error: "At least one field must be provided for update." });
      }
  
      
      const updatedUser = await User.findOneAndUpdate(
        {username},
        { $set: { firstName, lastName, email, phoneNumber } },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Return updated user profile
      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


// export const profileSettings =  async (req, res) => {
//     try {
//     const { firstName,lastName,email,phn_number } = req.body;
      
//         const userProfile = new ProfileSettingsModel({ firstName,lastName,email,phn_number });
//         const savedProfile = await userProfile.save(); //data saved to db
//         res.status(201).json(savedProfile);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

export const getProfileSettings = async (req, res) => {
  const { username } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findOne({username}).select(
      "firstName lastName email phoneNumber"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }};


// export const getProfileSettings =async (req, res) => {
//     try {
//       // Access email from request query parameters
//       const email = req.body.email;
//       // Validate email
//       if (!email) {
//         return res.status(400).json({ error: "Invalid email provided" });
//       }
  
//       // Find profile settings by email using Mongoose findOne()
//       const data = await ProfileSettingsModel.findOne({email});
  
//       if (data) {
//         res.json(data);
//       } else {
//         res.status(404).json("No Records found");
//       }
//     } catch (error) {
//       console.error(error); 
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
