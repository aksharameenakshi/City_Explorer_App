import express from "express";
import axios from "axios";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());


export const search = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        const googleApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

        const response = await axios.get(googleApiUrl, {
            params: {
                input: query,
                types: "geocode",  
                location: "50.0000,-85.0000",
                radius: 1000000,  
                components: "country:CA",
                key: process.env.GOOGLE_API_KEY
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        
        console.log("Google API Response:", JSON.stringify(response.data, null, 2));

        const cities = response.data.predictions.map(place => ({
            name: place.description,
            place_id: place.place_id
        }));

        res.json({ cities });
    } catch (error) {
        console.error("Error fetching cities:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch cities" });
    }
};

