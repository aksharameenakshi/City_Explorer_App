import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import session from "express-session"
import MongoStore from 'connect-mongo'
import { addGroup ,groupById,allGroup} from "./controllers/group.js";
import { profileSettings ,getProfileSettings} from "./controllers/profileSettings.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', //frontend's URL
    credentials: true
}));



app.use(session({
    secret: process.env.SESSION_SECRET, //shows the time user visits the app
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port${process.env.PORT}`);
});

app.post('/addGroup',addGroup);
app.get('/groupById',groupById)
app.get('/allGroup',allGroup)
app.post("/profile_settings",profileSettings);
app.get("/getprofilesettings",getProfileSettings ); 

// let passwordMatch=false
// app.post("/login", async (req, res) => { 
//     try {
//         const { email, password } = req.body;
//         const user = await UserModel.findOne({ email });
//         if (user) { 
//             if(password=== user.password){passwordMatch = true}
//             else{passwordMatch = false}
//                 if (passwordMatch) {
//                 req.session.user = { id: user._id, name: user.name, email: user.email }; 
//                 res.json("Success");
//                 } 
//                 else {
//                 res.status(401).json("Password doesn't match");
//              }
//         } 
//         else {
//             res.status(404).json("No Records found");
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// app.post("/logout", (req, res) => {
//     if (req.session) {
//         req.session.destroy(err => {
//             if (err) {
//                 res.status(500).json({ error: "Failed to logout" });
//             } else {
//                 res.status(200).json("Logout successful");
//             }
//         });
//     } else {
//         res.status(400).json({ error: "No session found" });
//     }
// });




