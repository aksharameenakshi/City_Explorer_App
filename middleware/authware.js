import {User} from "../models/Behavoir.js";

export const authentication = async function(req, res , next){
    try { 
        if(!req.session.userName) {
            global.loggedIn = false;  
            global.userData = ""; 
            req.session.destroy(()=> { });
            return res.status(200).render('message', { data:{message:"User session was terminated. Please login." } } ) 
        } 
        next();
    } catch (ex) {
        console.log(ex);
    }
}
