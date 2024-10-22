import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import Item from "../../models/items.model.js";
import Order from "../../models/order.model.js";
import mongoose from "mongoose";

export default async function pendingOrderHistory(req, res) {
  let userHistory = [];

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
    const user = await User.findOne({ _id: userId }).select("PendingOrders -_id").session(session);
    const PendingOrders = user.PendingOrders;
    if (PendingOrders.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "No pending orders found", success: true });
    }

    const itemPromises = PendingOrders.map(async (item) => {
      try {
        const itemData = await Order.findOne({ _id: item, isCancelled: false })
          .select("Items TotalPrice OrderTime orderStatus")
          .session(session);

        if (!itemData) {
          return null;
        }

        const coverItem = itemData.Items[0].Item;
        const coverImageLink = await Item.findOne({ _id: coverItem })
          .select("ImageLink -_id")
          .session(session);

        return {
          ...itemData.toObject(),
          coverImageLink,
        };
      } catch (error) {
        console.error(`Error fetching item with ID ${item}:`, error);
        return null;
      }
    });

    const itemData = await Promise.all(itemPromises);
    userHistory = itemData.filter(Boolean);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ userHistory, message: "Pending Order History", success: true });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message, success: false });
  }
}
