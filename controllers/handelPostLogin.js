import User from "../models/user.model.js";
import Seller from "../models/seller.model.js";
import DeliveryAgent from "../models/deliveryAgent.model.js";
import jwt from "jsonwebtoken";

export default async function handlePostLogin(req, res) {
  console.log("login")
  const { userEmail } = req.body;

  try {
    let user = await User.findOne({ userEmail: userEmail });
    if (!user) {

      let seller = await Seller.findOne({ SellerEmail: userEmail });
      if (!seller) {
        let deliveryAgent = await DeliveryAgent.findOne({ DeliveryAgentEmail: userEmail });
        if (!deliveryAgent) {
          return res.status(401).json({
            message: "No account exists with this email. Please sign up to continue.",
            success: false,
          });
        }
        else {
          // Create payload and sign token for seller
          const payload = {
            userId: deliveryAgent._id,
            isAdmin: false,
            isDeliveryAgent: true,
          };
          const cookie = jwt.sign(payload, process.env.JWTSECRETE, { expiresIn: "1d" });
          return res.cookie("orderNow", cookie, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite:"None"
          }).json({
            message: "Login successful",
            success: true,
          });
        }
      } else {
        // Create payload and sign token for seller
        const payload = {
          userId: seller._id,
          isAdmin: seller.isAdmin,
        };
        const cookie = jwt.sign(payload, process.env.JWTSECRETE, { expiresIn: "1d" });
        return res.cookie("orderNow", cookie, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite:"None"

        }).json({
          message: "Login successful",
          success: true,
        });
      }
    } else {
      // Create payload and sign token for user
      const payload = {
        userId: user._id,
        isAdmin: user.isAdmin,
      };
      const cookie = jwt.sign(payload, process.env.JWTSECRETE, { expiresIn: "1d" });
      return res.cookie("orderNow", cookie, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite:"None"

      }).json({
        message: "Login successful",
        success: true,
      });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later.", success: false });
  }
}
