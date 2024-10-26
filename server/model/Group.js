import mongoose from "mongoose";
const GroupSchema = new mongoose.Schema({
   
    gname:String,
    users:[{
        fname:String,
        lname:String,
        email:String,
        phn_number:Number
    }]
})

const GroupModel = mongoose.model("groups", GroupSchema);
export default GroupModel
// module.exports = GroupModel