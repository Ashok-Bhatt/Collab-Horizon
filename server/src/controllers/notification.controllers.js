import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getNotifications = async (req, res) => {

    const user = req.user;

    const notifications = await Notification.find(
        {
            notificationReceiver : user._id,
        }
    )

    if (!notifications){
        throw new ApiError(500, "Couldn't get notification");
    }

    return res.status(201).json(
        new ApiResponse(200, notifications, `All notifications received`)
    );

}


const sendNotification = async (req, res) => {

    const notificationReceiver = req.body?.notificationReceiver;
    const notificationMessage = req.body?.notificationMessage;

    if (!notificationReceiver || !notificationMessage){
        throw new ApiError(400, "Notification Receiver and Notification Message both are required!");
    }

    if (!notificationMessage.trim()){
        throw new ApiError(400, "Notification Message cannot be empty");
    }

    const newNotification = await Notification.create(
        {
            notificationReceiver,
            notificationMessage,
        }
    )

    if (!newNotification){
        throw new ApiError(500, "Couldn't create a new notification.");
    }

    return res.status(201).json(
        new ApiResponse(200, newNotification, "New notification created!")
    );

}


const deleteNotification = async(req, res) => {

    const loggedInUser = req.user;
    const notificationId = req.query?.notificationId;

    if (!notificationId || !notificationId.trim()){
        throw new ApiError(400, "Notification Id is required!");
    }

    const notification = await Notification.findById(notificationId);

    if (!notification){
        throw new ApiError(404, "Invalid notification Id!");
    }

    if (!notification.notificationReceiver.equals(loggedInUser._id)){
        throw new ApiError(403, "You are not authorized to delete this notification");
    }

    await notification.deleteOne();

    return res.status(201).json(
        new ApiResponse(200, notification, `Notification deleted successfully!`)
    );

}


export {
    getNotifications,
    sendNotification,
    deleteNotification,
}