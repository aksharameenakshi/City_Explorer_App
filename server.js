import express from "express"
import path from "path"
import { loginRoute } from "./controllers/login.js";
import { signupRoute } from "./controllers/signup.js";
import { eventRouteAdd, eventRouteDelete, eventRouteMyevents, eventRouteSearch,eventRouteFilter, eventRouteUp } from "./controllers/wishlist.js";
import cors from "cors"
import { jwtAuthentication } from "./middleware/authware.js";
import { addGroup ,groupById,allGroup} from "./controllers/community.js";
import { profileSettings ,getProfileSettings} from "./controllers/profileSettings.js";


const app = express();
app.use(cors());

// Middleware to parse JSON
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

import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT 


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
