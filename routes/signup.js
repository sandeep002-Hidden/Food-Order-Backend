import express from "express";
import handelPostSignup from "../controllers/handelPostSignup.js";

const signUpRouter = express.Router();

signUpRouter
  .get("/", (req, res) => {
    res.json({ signup: "Hello from Signup" });
  })
  .post("/", handelPostSignup);

export default signUpRouter;
