import express from "express";
import handelPostLogin from "../controllers/handelPostLogin.js";
const loginRouter = express.Router();
loginRouter
  .route("/")
  .get((req, res) => {
    res.json({ message: "From login page" });
  })
  .post(handelPostLogin);
export default loginRouter;
