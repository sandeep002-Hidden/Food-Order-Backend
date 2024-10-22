import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../models/user.model.js";

export default async function updateUserDetails(req, res) {
  const token = req.cookies.orderNow;
  const userName = req.body.userName;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!token) {
      await session.abortTransaction();
      return res.status(403).json({ message: "No token provided", success: false });
    }

    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);

    const result = await User.updateOne(
      { _id: decodedToken.userId },
      { $set: { userName: userName } },
      { session }
    );

    if (result.acknowledged) {
      await session.commitTransaction();
      return res.json({ message: "Updated Successfully", success: true });
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: "Update failed", success: false });
    }
  } catch (error) {
    console.error("Error occurred while updating user details:", error);
    await session.abortTransaction();
    return res.status(500).json({
      message: "An error occurred while updating the user details",
      success: false,
    });
  } finally {
    session.endSession();
  }
}
