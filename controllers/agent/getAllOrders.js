import jwt from "jsonwebtoken"
import Order from "../../models/order.model.js"
export default async function getAllOrders(req,res){
    try {
        const token = req.cookies.orderNow
        if(!token){
            return res.status(403).json({message:"No token!",success:false})
        }

        await Order.find({isDelivered:false,isCancelled:false,isPickedUp:false}).then((result)=>{
            return res.status(200).json({result,message:"get all the items",success:true})
        })

    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}
