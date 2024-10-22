import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default async function removeItemFromCart(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const token = req.cookies.orderNow;
        if (!token) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "No token!", success: false });
        }

        const removedItem = req.body._id;
        const userId = jwt.verify(token, process.env.JWTSECRETE).userId;

        await User.updateOne({ _id: userId }, { $pull: { Cart: removedItem } }, { session });

        await session.commitTransaction();
        session.endSession();

        return res.json({ message: "Removed item successfully", success: true });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.json({ message: error.message, success: false });
    } finally {
        session.endSession();
    }
}
