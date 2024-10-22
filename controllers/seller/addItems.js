import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Item from "../../models/items.model.js";

export default async function addItems(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const token = req.cookies.orderNow;
        if (!token) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "No token!", success: false });
        }

        const userId = jwt.verify(token, process.env.JWTSECRETE).userId;
        const { ItemName, ItemPrice, ItemDescription, ImageLink, TypeOfDish2 } = req.body;

        const newItem = new Item({
            ItemName,
            ItemPrice,
            ItemDescription,
            ImageLink,
            TypeOfDish: TypeOfDish2,
            NumberOfOrder: 0,
            SellerId: userId,
        });

        await newItem.save({ session });
        await session.commitTransaction();

        return res.json({ message: "Added Successfully", success: true });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error occurred while adding item:", error);
        return res.status(500).json({ message: "Error occurred while adding items", success: false });
    } finally {
        session.endSession();
    }
}
