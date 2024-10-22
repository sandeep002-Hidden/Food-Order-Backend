import jwt from "jsonwebtoken";
import Seller from "../../models/seller.model.js";
import mongoose from "mongoose";

export default async function updateAdminProfile(req, res) {
  const SellerName = req.body.SellerName;
  const token = req.cookies.orderNow;

  if (!token) {
    return res.status(403).json({ message: "No token!", success: false });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await Seller.updateMany(
        { _id: decodedToken.userId },
        { $set: { SellerName } }
      ).session(session);

      if (result.acknowledged) {
        await session.commitTransaction();
        return res.json({ message: "Updated successfully", success: true });
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: "Update failed", success: false });
      }
    } catch (error) {
      await session.abortTransaction();
      console.log("Error while updating the profile:", error);
      return res.status(500).json({ message: "Internal server error", success: false });
    }
  } catch (error) {
    return res.status(401).json({ message: "Error verifying token", success: false });
  } finally {
    session.endSession();
  }
}
