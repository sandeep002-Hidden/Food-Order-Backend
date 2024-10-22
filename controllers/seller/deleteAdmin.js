import Seller from "../../models/seller.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default async function deleteAdminAccount(req, res) {
  const token = req.cookies.orderNow;
  if (!token) {
    return res.status(403).json({ message: "No token!", success: false });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);
    
    await Seller.deleteOne({ _id: decodedToken.userId }).session(session);

    await session.commitTransaction();
    return res.json({ message: "Account deleted successfully", success: true });
    
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: error.message, success: false });

  } finally {
    session.endSession();
  }
}
