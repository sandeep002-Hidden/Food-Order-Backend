import jwt from "jsonwebtoken";
import Order from "../../models/order.model.js"
export default async function getAgentPickups(req,res){
    try {
        const token = req.cookies.orderNow;
        if(!token){
            return res.status(403).json({message:"no token!",success:false})
        }
        const userId=jwt.verify(token,process.env.JWTSECRETE).userId
        await Order.find({isDelivered:false,isCancelled:false,isPickedUp:true,DeliverAgentId:userId}).select("clientName clientEmail clientPhoneNo Country State District Pin Location TotalPrice _id").then(async(order)=>{
            return res.status(200).json({Items:order,message:"All agent pickup Items",success:true})
        })
    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}