import express from "express";
import bcrypt from "bcrypt";
import { loginSchema, User} from "../models/Behavoir.js"; 
const route = express.Router();
import jwt from 'jsonwebtoken';
export const secretKey = 'DND4U';

route.use(express.json());

export const loginRoute = async (req, res) => {
  console.log("testing");
  // Validate incoming data using the validation schema
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message); 
  }

  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username: req.body.userName });
  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  // Compare the input password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(password, user.password); 
  if (!isValidPassword) {
    return res.status(401).send('Invalid username or password');
  }

  
  const token = jwt.sign({ username:req.body.userName }, secretKey, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token }); 
};

export const logoutRoute = (req, res) => {
  
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : req.cookies.authorization;

  res.clearCookie('authorization'); 

  res.status(200).json({ message: 'Logged out successfully' });
  //res.redirect('/login');

}
