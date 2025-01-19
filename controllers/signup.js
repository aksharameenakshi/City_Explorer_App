import express from "express";
import bcrypt from "bcrypt";
import { signupSchema, organizerSignupSchema, User } from "../models/Behavoir.js";

const route = express.Router();

route.use(express.json());


// Signup route with validation
export const signupRoute = async (req, res) => {
  try {
    // Validate the incoming request data against the Joi schema
    const { error } = signupSchema.validate(req.body);
    if (error) {
      // Send a bad request response if validation fails
      return res.status(400).send(error.details[0].message);
    }

    const { firstName, lastName, phoneNumber, username, email, password, role } = req.body;

    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("Username or email is already taken.");
    }
  
  
    // Hash the password
    const saltRounds = 10;

    // Check for spaces in the password
    if (/\s/.test(password)) {
      throw new Error('Password should not contain spaces.');
    }
    
    // Hash the password if valid
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with validated input
    const newUser = new User({
      ...req.body,
      password: hashedPassword, 
      role: role || 'user',
    });

    // Save the new user to the database
    await newUser.save();
    res.status(200).send("User registered successfully. Please login to continue");
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Error registering user");
  }
};

export const eventOrgSignUp = async (req, res) => {
  try {
    
    const { error } = organizerSignupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, username, email, password, role, organizationName } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email is already taken.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newOrganizer = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: 'EVENT_ORGANIZER',
      organizationName,
    });

    await newOrganizer.save();

    res.status(201).json({ message: 'Event organizer account created successfully.' });
  } catch (err) {
    console.error('Organizer Signup Error:', err.message);
    res.status(500).json({ message: 'An error occurred while creating the account.' });
  }}