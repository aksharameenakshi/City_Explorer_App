import express from "express";
import bcrypt from "bcrypt";
import { loginSchema, User} from "../models/Behavoir.js"; 
const route = express.Router();
import jwt from 'jsonwebtoken';
export const secretKey = 'DND4U';

route.use(express.json());

export const loginRoute = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username: req.body.userName });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: req.body.userName, role: user.role }, secretKey, { expiresIn: '1h' });

  
    let response = {
      message: 'Login successful',
      role: user.role,
      username: user.username,
      token, 
    };

    if (user.role === 'EVENT_ORGANIZER') {
      response.message = 'Event organizer logged in successfully.';
    } else if (user.role === 'USER') {
      response.message = 'User logged in successfully.';
    } else if (user.role === 'admin') {
      response.message = 'Admin logged in successfully.';
    } else {
      return res.status(403).json({ message: 'Unauthorized role.' });
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

