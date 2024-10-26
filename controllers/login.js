import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { loginSchema, User} from "../models/Behavoir.js"; 
const route = express.Router();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/app-backend', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

route.use(express.json());

export const loginRoute = async (req, res) => {
  // Validate incoming data using the validation function
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message); // Send validation error
  }

  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  // Compare the input password with the hashed password in the database
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).send('Invalid username or password');
  }

  
  res.json( 'Login successful' );
};
