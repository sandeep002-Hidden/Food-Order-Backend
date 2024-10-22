import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import Order from "../../models/order.model.js";

export default async function getOrderHistory(req, res) {
    try {
        const token = req.cookies.orderNow;
        if (!token) {
            return res.status(403).json({ message: "No token provided!", success: false });
        }

        const userId = jwt.verify(token, process.env.JWTSECRETE).userId;

        // Find the user and get OrderHistory
        const user = await User.findOne({ _id: userId }).select("OrderHistory -_id");
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const orders = await Promise.all(
            user.OrderHistory.map(async (orderId) => {
                return await Order.findOne({ _id: orderId }).select("DeliverAgentName DeliverAgentPhoneNo TotalPrice Items")
            })
        );
        return res.status(200).json({ OrderHistory: orders, message: "Orders fetched successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}
