import express from "express";
import makeAgent from "../controllers/agent/makeAgent.js"
import getAllOrders from "../controllers/agent/getAllOrders.js"
import pickUpItem from "../controllers/agent/pickUpItem.js";
import getAgentPickups from "../controllers/agent/getAgentPickups.js"
import deliverOrder from "../controllers/agent/deliverOrder.js"
import getDeliveredItems from "../controllers/agent/getDeliveredItems.js"
import getProfileDetails from "../controllers/agent/getProfileDetails.js"
import deleteAccount from "../controllers/agent/deleteAccount.js"
const deliverAgentRouter = express.Router();


deliverAgentRouter.route("/makeAgent").post(makeAgent)
deliverAgentRouter.route("/getallorders").get(getAllOrders)
deliverAgentRouter.route("/pickUpItem").post(pickUpItem)
deliverAgentRouter.route("/pickupitems").get(getAgentPickups)
deliverAgentRouter.route("/deliverOrder").post(deliverOrder)
deliverAgentRouter.route("/getDeliveredItems").get(getDeliveredItems)
deliverAgentRouter.route("/getProfileDetails").get(getProfileDetails)
deliverAgentRouter.route("/deleteAccount").delete(deleteAccount)



export default deliverAgentRouter;