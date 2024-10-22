import mongoose from "mongoose";
const DeliveryAgentSchema=new mongoose.Schema({
    DeliveryAgentName:{
        type:String,
        required:true,
    },
    DeliveryAgentEmail: {
        type: String,
        required:true,
        unique:true
    },
    DeliveryAgentPhoneNo:{
        type:String,
        required:true,
    },
    DeliveryCharge:{
        type:Number,
        default:40
    },
    OrderDelivered:{
        type:Array,
        default:[]
    },
    TotalEarnings:{
        type:Number,
        default:0
    },
    pickedUpOrders:{
        type:Array,
        default:[]
    }
},{timestamps:true})
const DeliveryAgent=mongoose.model("deliveryAgent",DeliveryAgentSchema);
export default DeliveryAgent;