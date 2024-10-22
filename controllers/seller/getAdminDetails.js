import Seller from "../../models/seller.model.js";
import jwt from "jsonwebtoken";

export default async function getAdminDetails(req, res) {
  const token = req.cookies.orderNow;
  
  if (!token) {
    return res.status(403).json({ message: "No token!", success: false });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);

    try {
      const seller = await Seller.findOne({ _id: decodedToken.userId })
        .select("-SellerPassword -_id -createdAt -updatedAt");

      return res.json({ seller, success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }

  } catch (err) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
}
