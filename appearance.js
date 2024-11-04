import express from 'express'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());


export const userSettings = (req, res) => {
    const { theme, fontSize, color, fontStyle } = req.body;

    res.json({
        username: req.body.user,
        theme: theme || 'light',
        fontSize: fontSize || 'medium',
        color: color || '#000000',  
        fontStyle: fontStyle || 'Arial'  
    });
};



export const updateSettings = (req, res) => {
    const { theme, fontSize, color, fontStyle } = req.body;

    
    res.cookie('theme', theme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.cookie('fontSize', fontSize, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.cookie('color', color, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.cookie('fontStyle', fontStyle, { maxAge: 365 * 24 * 60 * 60 * 1000 }); 

    res.json({ message: 'Settings updated successfully' });
}







