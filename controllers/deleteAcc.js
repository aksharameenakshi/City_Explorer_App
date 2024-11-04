import express from 'express';
import { User } from '../models/Behavoir.js'; 
const route = express.Router();
route.use(express.json());


export const deleteAcc = async (req, res) => {
    try {
        const username = req.body; 

        
        const user = await User.findOne({username: req.body.userName});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        await User.findOneAndDelete({username: req.body.userName});

        
        res.clearCookie('token'); 

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'An error occurred while deleting the account' });
    }
}
