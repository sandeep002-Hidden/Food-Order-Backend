import Order from "../../models/order.model.js";
import Item from "../../models/items.model.js";
import User from "../../models/user.model.js";
import Seller from "../../models/seller.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default async function cancelOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const token = req.cookies.orderNow;
        const id = req.body.id;

        if (!token) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: "Unauthorized user", success: false });
        }

        const userId = jwt.verify(token, process.env.JWTSECRETE).userId;
        const order = await Order.findOne({ _id: id }).session(session);

        if (order) {
            for (const item of order.Items) {
                await Item.findByIdAndUpdate(item.Item, {
                    $inc: { NumberOfOrder: -item.Quantity }
                }, { session });

                const seller = await Item.findOne({ _id: item.Item }).select('SellerId').session(session);

                if (seller) {
                    await Seller.findByIdAndUpdate(
                        seller.SellerId,
                        {
                            $pull: { PendingDeliveries: { itemId: item.Item } },
                            $push: { CancelledDeliveries: { itemId: item.Item } }
                        },
                        { session }
                    );
                }
            }

            const orderId = new mongoose.Types.ObjectId(id);
            await User.findByIdAndUpdate(userId, {
                $pull: { PendingOrders: orderId },
                $push: { CancelledOrders: orderId }
            }, { session });

            await Order.findByIdAndUpdate(id, { $set: { isCancelled: true } }, { session });
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Order cancelled successfully", success: true });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: error.message, success: false });
    } finally {
        session.endSession();
    }
}
