import Order from "../../models/order.model.js";
import DeliveryAgent from "../../models/deliveryAgent.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export default async function pickUpItem(req, res) {
    const session = await mongoose.startSession();
    const OrderID = req.body.id;

    try {
        session.startTransaction();
        const token = req.cookies.orderNow;

        if (!token) {
            await session.abortTransaction();
            return res.status(403).json({ message: "No token!", success: false });
        }

        const userId = jwt.verify(token, process.env.JWTSECRETE).userId;

        const agent = await DeliveryAgent.findOne({ _id: userId }).session(session);
        if (!agent) {
            await session.abortTransaction();
            return res.status(401).json({ message: "Access Denied", success: false });
        }
        await Order.updateMany({ _id: OrderID }, { $set: { DeliverAgentName: agent.DeliveryAgentName, DeliverAgentPhoneNo: agent.DeliveryAgentPhoneNo, orderStatus: "picked by deliveryAgent",isPickedUp:true,DeliverAgentId:agent._id} }).then(async()=>{
            await session.commitTransaction();
            return res.status(200).json({ message: "Order picked up successfully", success: true });
        })
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ message: error.message, success: false });
    } finally {
        session.endSession();
    }
}
