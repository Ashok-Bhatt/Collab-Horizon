import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    getNotifications,
    sendNotification,
    deleteNotification,
} from "../controllers/notification.controllers.js";


const router = Router();

// Secure routes
router.route("/sendNotification").post(verifyJWT, sendNotification);
router.route("/getNotifications").get(verifyJWT, getNotifications);
router.route("/deleteNotification").delete(verifyJWT, deleteNotification);


export default router;