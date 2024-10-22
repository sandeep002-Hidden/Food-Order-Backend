import DeliveryAgent from "../../models/deliveryAgent.model.js"
import jwt from "jsonwebtoken"

export default async function deleteAccount(req, res) {
    try {
        const token = req.cookies.orderNow
        if (!token) {
            return res.status(403).json({ message: "No token!", success: false })
        }
        const userId = jwt.verify(token, process.env.JWTSECRETE).userId
        const result = await DeliveryAgent.deleteOne({ _id: userId });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Account deleted", success: true });
        } else {
            return res.status(404).json({ message: "Account not found", success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }

}