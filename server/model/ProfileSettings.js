const mongoose = require("mongoose");

const ProfileSettingsSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    phn_number:Number,
})

const ProfileSettingsModel = mongoose.model("profile_settings", ProfileSettingsSchema);

module.exports = ProfileSettingsModel;