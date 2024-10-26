import express from "express"
import path from "path"
import { loginRoute } from "./controllers/login.js";
import { signupRoute } from "./controllers/signup.js";
import { eventRouteAdd, eventRouteDelete, eventRouteMyevents, eventRouteSearch, eventRouteUp } from "./controllers/wishlist.js";
import cors from "cors"
import { authentication } from "./middleware/authware.js";

import  authentication  from "../middleware/authware.js";
const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());


app.post('/login', loginRoute);
app.post('/signup', signupRoute);
app.get('/upcomingevents', eventRouteUp);
app.get('/events/search', eventRouteSearch);
//app.post('/events/filter', eventRouteFilter);
app.get('/my-events', authentication, eventRouteMyevents);
app.post('/my-events/:eventId', authentication, eventRouteAdd);
app.delete('/my-events/:eventId', authentication, eventRouteDelete);

import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT 


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
