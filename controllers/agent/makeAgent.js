import jwt from "jsonwebtoken";
import DeliveryAgent from "../../models/deliveryAgent.model.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";

export default async function makeAgent(req, res) {
    const DeliveryAgentName = req.body.SellerName;
    const DeliveryAgentEmail = req.body.SellerEmail;
    const DeliveryAgentPhoneNo = req.body.phoneNo;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const token = req.cookies.orderNow;
        if (!token) {
            await session.abortTransaction();
            return res.status(403).json({ message: "No token provided!", success: false });
        }

        const userId = jwt.verify(token, process.env.JWTSECRETE).userId;

        const user = await User.findOne({ _id: userId }).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(401).json({ message: "Unauthorized user", success: false });
        }

        await User.deleteOne({ _id: userId }).session(session);

        const DeliveryAgentData = new DeliveryAgent({
            DeliveryAgentName,
            DeliveryAgentEmail,
            DeliveryAgentPhoneNo,
        });

        await DeliveryAgentData.save({ session });

        await session.commitTransaction();
        return res
            .status(200)
            .clearCookie("orderNow")
            .json({ message: "Account Created Successfully", success: true });
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    } finally {
        session.endSession();
    }
}
