import Order from "../../models/order.model.js"
import DeliveryAgent from "../../models/deliveryAgent.model.js"
import jwt from "jsonwebtoken"
export default async function getDeliveredItems(req,res){
    try {
        const token = req.cookies.orderNow
        if(!token){
            return res.status(403).json({message:"No token!",success:false})
        }
        const userId=jwt.verify(token,process.env.JWTSECRETE).userId
        await Order.find({DeliverAgentId:userId,isDelivered:true}).then((result)=>{
            return res.status(200).json({result,message:"get all the items",success:true})
        })

    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}