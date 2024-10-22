import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import Seller from "../../models/seller.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export default async function makeAdmin(req, res) {
  const {
    SellerName,
    SellerEmail,
    SellerPassword,
    phoneNo,
    Country,
    State,
    District,
    Pin,
    Location,
  } = req.body;

  console.log(req.body);

  const token = req.cookies.orderNow;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);
    console.log(decodedToken);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SellerPassword, salt);

    const sellerData = new Seller({
      SellerName,
      SellerEmail,
      SellerPassword: hashedPassword,
      phoneNo,
      Country,
      State,
      District,
      Pin,
      Location,
      isAdmin: true,
    });

    await User.deleteOne({ _id: decodedToken.userId }, { session });
    await sellerData.save({ session });
    await session.commitTransaction();

    return res
      .clearCookie("orderNow")
      .json({ message: "Account Created Successfully", success: true });
  } catch (error) {
    console.log(error);

    await session.abortTransaction();
    return res.status(500).json({
      message: "Error occurred while making Seller. No changes were made.",
      success: false,
    });
  } finally {
    session.endSession();
  }
}

