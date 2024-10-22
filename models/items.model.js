import mongoose from "mongoose";
const ItemSchema=new mongoose.Schema({
    ItemName:{
        type:String,
        required:true,
        lowercase: true
    },
    SellerId:{
        type:String,
    },
    ItemPrice:{
        type:Number,
        required:true,
    },
    ImageLink:{
        type:String,
        required:true
    },
    ItemDescription:{
        type:String
    },
    TypeOfDish:{
        type:Array,
    },
    NumberOfOrder:{
        type:Number,
        default:0
    },
},{timestamps:true})

const Item=mongoose.model("item",ItemSchema);
export default Item;