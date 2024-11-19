import jwt from 'jsonwebtoken';
import { User } from '../models/Behavoir.js';
import { secretKey } from '../controllers/login.js';

export const authentication = (req, res, next) => {
    const bearer = req.headers.authorization;

    if(!bearer){
        res.status(401);
        res.json({message: "Not authorized"});
        return;
    }

    const [, token] = bearer.split(' ');

    if(!token){
        res.status(401);
        res.json({message: "Not a valid token"});
        return;
    }

    try {
        const user = jwt.verify(token, secretKey);
        req.user = user;
        next();
    } catch (e) {
        console.error(e);
        res.status(401);
        res.json({message: "Not valid token"});
        return;
    }
}  
