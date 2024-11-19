import express from "express";
<<<<<<< HEAD
import { AboutUsModel , TermsAndConditionModel ,PrivacyPolicyModel} from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());

    export const getAboutUs = async (req, res) => {
        try {
            const aboutUs = await AboutUsModel.find();
            if (aboutUs.length > 0) {
                res.json(aboutUs);
            } else {
                res.status(404).json({ error: 'Description not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    export const getTermsAndCondition = async (req, res) => {
        try {
            const termsAndCondition = await TermsAndConditionModel.find();
            if (termsAndCondition.length > 0) {
    
                res.json(termsAndCondition)
            } else {
                res.status(404).json({ error: 'Description not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    export const getPrivacyPolicy = async (req, res) => {
        try {
            const privacyPolicy = await PrivacyPolicyModel.find();
    
            if (privacyPolicy.length > 0) {
    
                res.json(privacyPolicy);
            } else {
                res.status(404).json({ error: 'Description not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
=======
import { ProfileSettingsModel } from "../models/Behavoir.js";
const route = express.Router();
route.use(express.json());

export const profileSettings =  async (req, res) => {
    try {
    const { firstName,lastName,email,phn_number } = req.body;
      
        const userProfile = new ProfileSettingsModel({ firstName,lastName,email,phn_number });
        const savedProfile = await userProfile.save(); //data saved to db
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProfileSettings =async (req, res) => {
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
      console.error(error); 
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
>>>>>>> 84f3b670ee530f847d3053e9f595dfa1f073ae74
