import express from "express";
import bcrypt from "bcrypt";
import { signupSchema, User} from "../models/Behavoir.js";

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

    const { firstName, lastName, phoneNumber, username, email, password } = req.body;

    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("Username or email is already taken.");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with validated input
    const newUser = new User({
      ...req.body,
      password: hashedPassword, 
    });

    // Save the new user to the database
    await newUser.save();
    res.status(200).send("User registered successfully. Please login to continue");
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Error registering user");
  }
};