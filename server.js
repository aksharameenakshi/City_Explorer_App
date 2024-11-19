import express from "express"
import mongoose from "mongoose";
import path from "path"
import { loginRoute } from "./controllers/login.js";
import { signupRoute } from "./controllers/signup.js";
import { eventRouteAdd, eventRouteDelete, eventRouteMyevents, eventRouteSearch,eventRouteFilter, eventRouteUp } from "./controllers/wishlist.js";
import cors from "cors"
import { authentication } from "./middleware/authware.js";
import { groupById,allGroup,addGroupUser,group} from "./controllers/community.js";
import { profileSettings ,getProfileSettings} from "./controllers/profileSettings.js";
import { getAboutUs, getPrivacyPolicy, getTermsAndCondition } from "./controllers/profiledescription.js"
import { forgotPassword, resetPassword} from "./controllers/forgotpassword.js";
import { userSettings, updateSettings } from "./controllers/appearance.js";
import { deleteAcc } from "./controllers/deleteAcc.js";
import { reminderRoute, notificationRoute } from "./controllers/notification.js";
import { feedbackRoute } from "./controllers/feedback.js";
import { reportRoute, adminReplyRoute } from "./controllers/Helpcenter.js";
import { addMessges , deleteMessage ,editMessage,getAllMessages,getMessageById} from "./controllers/message.js";


const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());


app.post('/login', loginRoute);
app.post('/signup', signupRoute);
app.get('/upcomingevents', eventRouteUp);
app.get('/events/search', eventRouteSearch);
app.post('/events/filter', eventRouteFilter);
app.get('/my-events', [authentication], eventRouteMyevents);
app.post('/my-events', [authentication], eventRouteAdd);
app.delete('/my-events', [authentication], eventRouteDelete);
app.get('/groupById',groupById);
app.get('/allGroup', [authentication],allGroup);
app.post("/add_guser",addGroupUser),
app.post("/profile_settings", [authentication], profileSettings);
app.get("/getprofilesettings",[authentication], getProfileSettings); 
app.get("/getAboutUs",[authentication],getAboutUs); 
app.get("/getTermsAndCondition",[authentication],getTermsAndCondition); 
app.get("/getPrivacy",[authentication],getPrivacyPolicy);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);
app.get('/preferences', [authentication], userSettings);
app.put('/preferences',[authentication], updateSettings);
app.post('/logout',loginRoute);
app.delete('/delete-account', [authentication], deleteAcc);
app.post('/reminders', [authentication], reminderRoute);
app.get('/notifications', [authentication], notificationRoute);
app.post('/feedback', [authentication], feedbackRoute);
app.post('/report', [authentication], reportRoute);
app.post('/admin-reply', [authentication], adminReplyRoute);
app.post('/addmessages', addMessges)
app.delete('/deleteMessage',deleteMessage)
app.put('/editMessage',editMessage)
app.get('/getAllMessages',getAllMessages) 
app.get('/getMessageById',getMessageById)
app.get('/group',group)
import dotenv from "dotenv";
dotenv.config()

mongoose.connect("mongodb://localhost/app-backend");

global.PORT = process.env.PORT || 2024

app.listen(global.PORT, () => {
console.log(`connection has been created on ${global.PORT}`);
});
