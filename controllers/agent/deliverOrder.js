import jwt from "jsonwebtoken";
import Order from "../../models/order.model.js"
import User from "../../models/user.model.js"
import DeliveryAgentSchema from '../../models/deliveryAgent.model.js'
import Seller from "../../models/seller.model.js"
import Item from "../../models/items.model.js"
import mongoose from "mongoose"
export default async function deliverOrder(req, res) {
    try {
        const token = req.cookies.orderNow;
        if (!token) {
            return res.status(403).json({ message: "no token!", success: false });
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const userId = jwt.verify(token, process.env.JWTSECRETE).userId; 
            const orderId = req.body.orderId;
            //done
            await DeliveryAgentSchema.updateMany(
                { _id: userId },
                {
                    $push: { OrderDelivered: orderId },
                    $pull: { pickedUpOrders: orderId }
                },
                { session }
            );
            // done
            await Order.updateOne({ _id: orderId }, { $set: { isDelivered: true } }, { session });
            const order = await Order.findOne({ _id: orderId }).session(session);
            if (order) {
                await User.updateMany(
                    { userEmail: order.clientEmail },
                    {
                        $pull: { PendingOrders: new mongoose.Types.ObjectId(order._id) },
                        $push: { OrderHistory: new mongoose.Types.ObjectId(order._id) }
                    },
                    { session }
                );
                for (const item of order.Items) {

                    const itemData = await Item.findOne({ _id: item.Item }).session(session);
                    if (itemData) {
                        await Seller.updateMany(
                            { _id: itemData.SellerId },
                            {
                                $pull: { PendingDeliveries: { itemId: item.Item } },
                                $push: { DeliveryHistory: item.Item }
                            },
                            { session }
                        );
                    }
                }
            }
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Order delivered successfully", success: true });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error during transaction:", error.message);
            return res.status(500).json({ message: error.message, success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}