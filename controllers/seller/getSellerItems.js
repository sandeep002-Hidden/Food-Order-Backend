import jwt from "jsonwebtoken"
import Seller from "../../models/seller.model.js"
import Item from "../../models/items.model.js"


export default async function getSellerItems(req, res) {
    try {
        const token = req.cookies.orderNow;
        if (!token) {
            return res.status(401).json({ message: "login to continue", success: false })
        }
        const userId = jwt.verify(token, process.env.JWTSECRETE).userId
        await Seller.findOne({ _id: userId }).then((user) => {
            if (!user) {
                return res.status(401).json({ message: "User is not exists", success: false })
            }
        })
        await Item.find({ SellerId: userId }).select("-__v -updatedAt -createdAt -_id").then((result) => {
            return res.status(200).json({Items:result, message: "success", success: true })
        })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}