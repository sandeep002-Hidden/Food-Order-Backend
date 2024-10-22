import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

export default async function deleteAccount(req, res) {
  
  const token =req.cookies.orderNow;
  if(!token){
    return res.status(403).json({message:"No token",success:false})
  }
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);
  await User.deleteOne({ _id: decodedToken.user })
    .then((result) => {
      return res.json({ message: "Account deleted Successfully",success:true });
    })
    .catch((error) => {
      return res.json({ message: error.message,success:false });
    });
}
