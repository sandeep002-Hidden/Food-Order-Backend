import DeliveryAgent from "../../models/deliveryAgent.model.js"
import jwt from "jsonwebtoken"
export default async function getProfileDetails(req,res){
    try {
        const token = req.cookies.orderNow
        if(!token){
            return res.status(403).json({message:"No token!",success:false})
        }
        const userId=jwt.verify(token,process.env.JWTSECRETE).userId
        await DeliveryAgent.findOne({_id:userId}).select("-_id -createdAt -updatedAt -__v -pickedUpOrders").then((result)=>{
            return res.status(200).json({result,message:"got profile details",success:true})
        })
    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}