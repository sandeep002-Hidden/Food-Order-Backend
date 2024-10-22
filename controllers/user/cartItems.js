import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import Item from "../../models/items.model.js";

export default async function cartItems(req, res) {
  try {
    const token =req.cookies.orderNow;
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access Denied: No Token Provided!", success: false });
    }
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);
    const userId = decodedToken.userId;
    const user = await User.findOne({ _id: userId }).select("-userEmail -userPassword -OrderHistory -createdAt -updatedAt")
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    const cartItemIds = user.Cart;
    const cartItems = await Item.find({ _id: { $in: cartItemIds } });
    return res.json({ cartItems, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}
