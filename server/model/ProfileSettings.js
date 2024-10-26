import mongoose from "mongoose";
const ProfileSettingsSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    phn_number:Number,
})

const ProfileSettingsModel = mongoose.model("profile_settings", ProfileSettingsSchema);
export default ProfileSettingsModel
// module.exports = ProfileSettingsModel;