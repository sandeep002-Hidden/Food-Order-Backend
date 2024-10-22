import express from "express";
import handelGetUserDetails from "../controllers/user/handelGetUserDetail.js";
import updateUserDetails from "../controllers/user/updateUserDetails.js";
import deleteAccount from "../controllers/user/deleteAccount.js";
import getItems from "../controllers/user/getItems.js";
import addToCart from "../controllers/user/addToCart.js";
import cartItems from "../controllers/user/cartItems.js";
import removeItemFromCart from "../controllers/user/removeItemFromCart.js";
import findItem from "../controllers/user/findItem.js";
import logout from "../controllers/logout.js"
import buyCartItems from "../controllers/user/buyCartItems.js"
import getOrderHisory from "../controllers/user/getOrderHisory.js"
import pendingOrderHistory from "../controllers/user/pendingOrderHistory.js"
import getOrderItems from "../controllers/user/getOrderItems.js"
import cancelOrder from "../controllers/user/cancelOrder.js"
const userRouter = express.Router();

userRouter.route("/profile").get(handelGetUserDetails);
userRouter.route("/updateProfile").post(updateUserDetails);
userRouter.route("/deleteAccount").post(deleteAccount);
userRouter.route("/getItems").get(getItems);
userRouter.route("/addToCart").post(addToCart);
userRouter.route("/getCartItems").get(cartItems);
userRouter.route("/removeItemFromCart").delete(removeItemFromCart);
userRouter.route("/findItem").post(findItem);
userRouter.route("/logout").get(logout)
userRouter.route("/buyCartItem").post(buyCartItems)
userRouter.route("/getOrderHisory").get(getOrderHisory)
userRouter.route("/pendingOrderHistory").get(pendingOrderHistory)
userRouter.route("/getOrderItems").post(getOrderItems)
userRouter.route("/cancelOrder").post(cancelOrder)

export default userRouter;
