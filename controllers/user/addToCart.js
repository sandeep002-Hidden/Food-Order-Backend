import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default async function addToCart(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const token = req.cookies.orderNow;
        if (!token) {
            await session.abortTransaction();
            return res.status(403).json({ message: "No token!", success: false });
        }

        const decodedToken = jwt.verify(token, process.env.JWTSECRETE);

        await User.updateOne(
            { _id: decodedToken.userId },
            { $push: { Cart: req.body.id } },
            { session }
        );

        await session.commitTransaction();
        return res.json({ message: "Item added to the cart", success: true });
    } catch (error) {
        await session.abortTransaction();
        return res.json({ message: error.message, success: false });
    } finally {
        session.endSession();
    }
}
