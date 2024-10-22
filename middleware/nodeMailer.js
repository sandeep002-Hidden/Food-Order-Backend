import User from "../models/user.model.js";
import Seller from "../models/seller.model.js";
import nodemailer from "nodemailer";
import DeliveryAgent from "../models/deliveryAgent.model.js"

export default async function sendEmail(req, res) {
  const max = 999999;
  const min = 100000;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`otp is ${otp}`);
  const myMail = process.env.EMAIL;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: myMail,
      pass: process.env.EMAILPASS,
    },
  });
  const sendEmail = (email, token) => {
    const mailOptions = {
      from: myMail,
      to: email,
      subject: "Email verification",
      text: `your otp is ${otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error in sending email  " + error);
        return true;
      } else {
        return false;
      }
    });
  };
  const email = req.body.userEmail;
  try {
    const user = await User.findOne({ userEmail: email });
      if (!user) {
      const seller = await Seller.findOne({ SellerEmail: email });
      if (!seller) {
        const deliveryAgent = await DeliveryAgent.findOne({ DeliveryAgentEmail: email });
        if (!deliveryAgent) {
          return res.json({
            message: "Provided email is not associated with any authenticated user.",
            success:false
          });
        } else {
          sendEmail(email);
          return res.json({ Otp: otp,success:false
          });
        }
      } else {
        sendEmail(email);
        return res.json({ Otp: otp,success:false
        });
      }
    } else {
      sendEmail(email);
      return res.json({ Otp: otp,success:true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while processing your request.",success:false
    });
  }
  
}
