import express from "express"
import path from "path"
import { loginRoute, logoutRoute} from "./controllers/login.js";
import { signupRoute } from "./controllers/signup.js";
import { eventRouteAdd, eventRouteDelete, eventRouteMyevents, eventRouteSearch,eventRouteFilter, eventRouteUp } from "./controllers/wishlist.js";
import cors from "cors"
import { jwtAuthentication } from "./middleware/authware.js";
import { addGroup ,groupById,allGroup} from "./controllers/community.js";
import { profileSettings ,getProfileSettings} from "./controllers/profileSettings.js";
import { forgotPassword, resetPassword} from "./controllers/forgotpassword.js";
import { userSettings, updateSettings } from "./controllers/appearance.js";
import { deleteAcc } from "./controllers/deleteAcc.js";
import { reminderRoute, notificationRoute } from "./controllers/notification.js";
import { feedbackRoute } from "./controllers/feedback.js";
import { reportRoute, adminReplyRoute, sendEmailNotification} from "./controllers/Help center.js";





const app = express();
app.use(cors());



app.use(express.json());


app.post('/login', loginRoute);
app.post('/signup', signupRoute);
app.get('/upcomingevents', eventRouteUp);
app.get('/events/search', eventRouteSearch);
app.post('/events/filter', eventRouteFilter);
app.get('/my-events', jwtAuthentication, eventRouteMyevents);
app.post('/my-events', jwtAuthentication, eventRouteAdd);
app.delete('/my-events', jwtAuthentication, eventRouteDelete);
app.post('/addGroup',jwtAuthentication, addGroup);
app.get('/groupById',groupById);
app.get('/allGroup',jwtAuthentication,allGroup);
app.post("/profile_settings", jwtAuthentication, profileSettings);
app.get("/getprofilesettings",jwtAuthentication, getProfileSettings); 
app.post('/forgot-password', forgotPassword);
app.post('/reset-password/:token', resetPassword);
app.get('/preferences', jwtAuthentication, userSettings);
app.put('/preferences',jwtAuthentication, updateSettings);
app.post('/logout', logoutRoute);
app.delete('/delete-account', jwtAuthentication, deleteAcc);
app.post('/reminders', jwtAuthentication, reminderRoute);
app.get('/notifications', jwtAuthentication, notificationRoute);
app.post('/feedback', jwtAuthentication, feedbackRoute);
app.post('/report', jwtAuthentication, reportRoute);
app.post('/admin-reply', jwtAuthentication, adminReplyRoute);
app.post('/reply-notification', jwtAuthentication, sendEmailNotification);



import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT 


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
