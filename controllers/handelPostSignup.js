import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export default async function handelPostSignup(req, res) {
  try {
    const {
      userName,
      userEmail,
      userPassword,
      phoneNo,
      country,
      State,
      District,
      Pin,
      Location,
    } = req.body;
    
    const distinctUserEmail = await User.distinct("userEmail");
    const distinctUserPhoneNo = await User.distinct("phoneNo");
    if (distinctUserEmail.includes(userEmail)) {
      return res.status(400).json({
        message: "This Email id is connected with other account",
        success: false
      });
    }
    if (distinctUserPhoneNo.includes(phoneNo)) {
      return res.status(400).json({
        message:
          "This Phone No is connected with other account,try with Other account",
        success: false
      });
    }
    const userData = new User({
      userName,
      userEmail,
      userPassword,
      phoneNo,
      country,
      State,
      District,
      Pin,
      Location,
    });
    userData.isAdmin = false;
    const salt = await bcrypt.genSalt(10);
    userData.userPassword = await bcrypt.hash(userPassword, salt);
    await userData.save();
    return res.status(200).json({ message: "User Registered successfully", success: true })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
