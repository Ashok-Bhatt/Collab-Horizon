import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getNotifications = async (req, res) => {
    const user = req.user;

    if (!user || !user._id) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Unauthorized: User not found"));
    }

    const notifications = await Notification.find({
        notificationReceiver: user._id,
    });

    if (!notifications) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Couldn't get notifications"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notifications, "All notifications received"));
};


const sendNotification = async (req, res) => {
    const notificationReceiver = req.body?.notificationReceiver;
    const notificationMessage = req.body?.notificationMessage;

    if (!notificationReceiver || !notificationMessage) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Notification Receiver and Notification Message both are required!"));
    }

    if (!notificationMessage.trim()) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Notification Message cannot be empty"));
    }

    const newNotification = await Notification.create({
        notificationReceiver,
        notificationMessage,
    });

    if (!newNotification) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Couldn't create a new notification."));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newNotification, "New notification created!"));
};


const deleteNotification = async (req, res) => {
    const loggedInUser = req.user;
    const notificationId = req.query?.notificationId;

    if (!notificationId || !notificationId.trim()) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Notification Id is required!"));
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Invalid notification Id!"));
    }

    if (!notification.notificationReceiver.equals(loggedInUser._id)) {
        return res
            .status(403)
            .json(new ApiResponse(403, null, "You are not authorized to delete this notification"));
    }

    await notification.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, notification, "Notification deleted successfully!"));
};

export {
    getNotifications,
    sendNotification,
    deleteNotification,
};