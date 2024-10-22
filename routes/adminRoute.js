import express from "express";

import addItems from "../controllers/seller/addItems.js";
import updateAdminProfile from "../controllers/seller/updateAdminProfile.js"
import makeAdmin from "../controllers/seller/makeAdmin.js";
import getAdminDetails from "../controllers/seller/getAdminDetails.js";
import deleteAdminAccount from "../controllers/seller/deleteAdmin.js";
import apendingOrders from "../controllers/seller/apendingOrders.js"
import getSellerItems from "../controllers/seller/getSellerItems.js"

const adminRouter = express.Router();

adminRouter.route("/addItems").post(addItems);
adminRouter.route("/makeAdmin").post(makeAdmin);
adminRouter.route("/getDetails").get(getAdminDetails);
adminRouter.route("/updateProfile").post(updateAdminProfile);
adminRouter.route("/deleteAccount").post(deleteAdminAccount);
adminRouter.route("/apendingOrders").get(apendingOrders);
adminRouter.route("/getSellerItems").get(getSellerItems);

export default adminRouter;