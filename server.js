import User from "./models/user.model.js";
import Seller from "./models/seller.model.js";
import DeliveryAgent from "./models/deliveryAgent.model.js"
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import signUpRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import jwt from "jsonwebtoken";
import userRouter from "./routes/userDetails.js";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoute.js";
import sendEmail from "./middleware/nodeMailer.js";
import cookieParser from "cookie-parser";
import deliverAgentRouter from "./routes/deliverAgent.router.js"


dotenv.config();

const app = express();
console.log(process.env.EMAIL)
try {
  connectDB();
  console.log("Connected success fully");
} catch (error) {
  console.log("error while connecting with Database");
}
app.use(cookieParser())

app.use(cors({
  origin: ['http://localhost:3000','https://ordernow-sandeepmohapatra.vercel.app' ,'http://192.168.6.182:8000',null],
  credentials: true,
}));

app.use(express.json());

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/sendEmail", sendEmail);
app.use("/agent",deliverAgentRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/verify", async (req, res) => {
  const token = req.cookies.orderNow;
  if (!token) {
    return res.status(401).json({ message: "Login to continue", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETE);
    const userId = decoded.userId;

    let user = await User.findOne({ _id: userId });
    if (user) {
      return res.json({ _id: userId, role: "user", success: true });
    }
    let seller = await Seller.findOne({ _id: userId });
    if (seller) {
      return res.json({ _id: userId, role: "seller", success: true });
    }
    let deliveryAgent = await DeliveryAgent.findOne({ _id: userId });
    if (deliveryAgent) {
      return res.json({ _id: userId, role: "deliveryAgent", success: true });
    }
    return res.status(404).json({ message: "No account found", success: false });
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid", success: false });
  }
});
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT} `);
});
