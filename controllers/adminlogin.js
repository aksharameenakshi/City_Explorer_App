import express from 'express';
import bcrypt from 'bcrypt';
import { Admin } from '../models/Behavoir.js';


const app = express();
app.use(express.json());

export const initializeApp = async () => {
    const existingAdmin = await Admin.findOne({ role: 'admin' })
  
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new Admin({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      });
  
      await admin.save();
      console.log('Default admin created.');
    } else {
      console.log('Admin already exists. Skipping creation.');
    }
  };

  