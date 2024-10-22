import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    userEmail:{
        type:String,
        unique:true,
        required:true
    },
    userPassword:{
        type:String,
        required:true,
    },
    phoneNo:{
        type:String,
        required:true,
        unique:true
    },
    country:{
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    Pin:{
        type:String,
        required:true
    },
    Location:{
        type:String,
    },
    Cart:{
        type:Array,
    },
    OrderHistory:{
        type:Array,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    PendingOrders:{
        type:Array,
    },
    CancelledOrders:{
        type:Array,
    }
    
},{timestamps:true})


const User=mongoose.model("user",UserSchema);
export default User;