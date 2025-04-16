import express from "express"
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { loginRoute } from "./controllers/login.js";
import { signupRoute } from "./controllers/signup.js";
import cors from "cors"
import { authentication } from "./middleware/authware.js";
import { allGroup,addGroupUser,group,deleteGroup,removeUserFromGroup,userListInGroup} from "./controllers/community.js";
import { profileSettings ,getProfileSettings} from "./controllers/profileSettings.js";
import { getAboutUs, getPrivacyPolicy, getTermsAndCondition } from "./controllers/profiledescription.js"
import { forgotPassword, resetPassword} from "./controllers/forgotpassword.js";
import { getNotifications, eventAdded, eventRemoved } from "./controllers/notification.js";
import { search } from "./controllers/search.js";
import {conStatus, viewEvent } from "./controllers/adminview.js"
import { addEvents, allEvents, deleteEvent, editEvent,  eventCategoryForOrg,eventCategoryForUsers, eventRouteMyevents, addToWishlist, removeFromWishlist } from "./controllers/event.js";
import { deleteAcc } from "./controllers/deleteAcc.js";
// import { initializeApp } from "./controllers/adminlogin.js";

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());


app.post('/login', loginRoute);
app.post('/signup', signupRoute);
app.delete('/delete-account', [authentication], deleteAcc);
app.get('/my-events', [authentication], eventRouteMyevents);
app.post('/wishlist/add', [authentication], addToWishlist );
app.post('/wishlist/remove', [authentication], removeFromWishlist);
app.get('/allGroup', [authentication],allGroup);
app.post("/profile_settings", [authentication], profileSettings);
app.get("/getprofilesettings",[authentication], getProfileSettings); 
app.get("/getAboutUs",[authentication],getAboutUs); 
app.get("/getTermsAndCondition",[authentication],getTermsAndCondition); 
app.get("/getPrivacy",[authentication],getPrivacyPolicy);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);
app.post('/event/notification', [authentication], eventAdded);
app.delete('/event/remove/notification', [authentication], eventRemoved);
app.get('/notifications', [authentication], getNotifications);
app.post('/group',[authentication], group),
app.post("/add_guser",[authentication], addGroupUser)
app.delete('/removeUserGroup',[authentication],  removeUserFromGroup);
app.delete('/deleteGroup', [authentication], deleteGroup);
app.get('/userListInGroup',[authentication], userListInGroup);
// app.post('/admin/create, initializeApp)'
app.get('/admin/events', [authentication], viewEvent);
app.patch('/admin/approve/events', [authentication], conStatus);
app.get('/api/cities', [authentication], search);
app.post('/addEvents', [authentication], addEvents);
app.get('/allEvents', [authentication], allEvents);
app.delete('/events/delete',[authentication], deleteEvent);
app.put('/events/editEvent/:id', [authentication], editEvent);
app.get('/events/category/organizer', [authentication], eventCategoryForOrg)
app.get('/events/category/user', eventCategoryForUsers)




dotenv.config({ path: './.env' })

mongoose.connect('Replace with MongoDB URL Here');

//  await initializeApp();

global.PORT = process.env.PORT || 2024

app.listen(global.PORT, () => {
console.log(`connection has been created on ${global.PORT}`);
});
