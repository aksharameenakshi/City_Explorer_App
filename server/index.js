const express = require("express"); //builds web servers
const mongoose = require("mongoose");
const cors = require("cors"); 
const dotenv = require("dotenv");
const session = require("express-session"); 
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User"); //mentioning datatype for table
const ProfileSettingsModel = require("./model/ProfileSettings");
const GroupModel = require("./model/Group");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', //frontend's URL
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));



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


let passwordMatch=false

app.post("/login", async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) { 
            if(password=== user.password){passwordMatch = true}
            else{passwordMatch = false}
                if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email }; 
                res.json("Success");
                } 
                else {
                res.status(401).json("Password doesn't match");
             }
        } 
        else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.post("/profile_settings", async (req, res) => {
    try {
    const { fname,lname,email,phn_number } = req.body;
      
        const userProfile = new ProfileSettingsModel({ fname,lname,email,phn_number });
        const savedProfile = await userProfile.save(); //data saved to db
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/getprofilesettings", async (req, res) => {
    try {
      // Access email from request query parameters
      const email = req.body.email;
      // Validate email
      if (!email) {
        return res.status(400).json({ error: "Invalid email provided" });
      }
  
      // Find profile settings by email using Mongoose findOne()
      const data = await ProfileSettingsModel.findOne({email});
  
      if (data) {
        res.json(data);
      } else {
        res.status(404).json("No Records found");
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 

  app.post("/group", async (req, res) => {
    try {
    const { gname,users } = req.body;
      
        const newGroup = new GroupModel({ gname,users });
        const savedGroup = await newGroup.save();
        const groupDetails = {
            id: savedGroup._id,
            gname: savedGroup.gname,
          };
          res.status(201).json(groupDetails);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error." }); 
        }
});

app.get("/getgroup", async (req, res) => {
    try {
      const groupId = req.body.groupId;
  
      // Finding a single group by ID, including the users array
      const group = await GroupModel.findById(groupId).populate("users");
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }
  
      const groupDetails = {        //"groupDetails" as object  
        id: group._id,
        gname: group.gname,
        users: group.users.map(user => ({  //"user" as array
          fname: user.fname,               //showing only the required details of the users 
          lname: user.lname,
          email: user.email
        }))
      };
  
      res.status(200).json(groupDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });


  app.get("/getallgroup", async (req, res) => {

    GroupModel.find()
    .then((groups) => {
      
      res.status(200).json(groups);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching groups', error });
    });
  });