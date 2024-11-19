import express from 'express'
import { User } from '../models/Behavoir.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());


export const userSettings = async (req, res) => {
    try {

        const { username } = req.body; 

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const settings = user.settings?.[0] || {};

        
        res.json({
            message: 'User settings fetched successfully',
            settings: {
                theme: settings.theme || 'light',
                fontSize: settings.fontSize || 'medium',
                color: settings.color || '#000000',
                fontStyle: settings.fontStyle || 'Arial',
            },
        });
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Error fetching user settings', error: error.message });
    }
};


export const updateSettings = async (req, res) => {
    try {
        
        const { theme, fontSize, color, fontStyle } = req.body;

        
        const updates = {};
        if (theme) updates["settings.theme"] = theme;
        if (fontSize) updates["settings.fontSize"] = fontSize;
        if (color) updates["settings.color"] = color;
        if (fontStyle) updates["settings.fontStyle"] = fontStyle;
<<<<<<< HEAD

       
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No settings provided for update' });
        }

        
        const { username } = req.body;

        
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        
        const updatedUser = await User.findOneAndUpdate(
            { username: username },  
            { $set: updates },      
            { new: true }            
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        res.json({
            message: 'Settings updated successfully',
            settings: updatedUser.settings,  
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
};


        

=======
>>>>>>> 84f3b670ee530f847d3053e9f595dfa1f073ae74

       
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No settings provided for update' });
        }

        
        const { username } = req.body;

        
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        
        const updatedUser = await User.findOneAndUpdate(
            { username: username },  
            { $set: updates },      
            { new: true }            
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        res.json({
            message: 'Settings updated successfully',
            settings: updatedUser.settings,  
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
};
