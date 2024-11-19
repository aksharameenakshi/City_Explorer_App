import express from "express";
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

