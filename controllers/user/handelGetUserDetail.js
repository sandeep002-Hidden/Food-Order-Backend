import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

export default async function handelGetUserDetails(req, res) {
  const token =req.cookies.orderNow;
  if(!token){
    return res.status(401).json({message:'token not found',success:false})
  }
    const decodedToken = jwt.verify(token, process.env.JWTSECRETE);
    try{
      const user = await User.findOne({ _id: decodedToken.userId }).select("-userPassword -_id -createdAt -updatedAt");
      return res.status(200).json({user,success:true})

    }
    catch(error){
      return res.status(401).json({ message: error.message,success:false });    }
  
}
