import { Notification } from "../models/notification.model.js";


const getNotifications = async (req, res) => {

    const user = req.user;
    console.log(user._id);

    const notifications = await Notification.find(
        {
            notificationReceiver : user._id,
        }
    )

    if (!notifications){
        throw Error("Couldn't get notification");
    }

    res.status(200).json(
        {
            status: 200,
            message: "All notifications received!",
            notifications
        }
    )

}


const sendNotification = async (req, res) => {

    const notificationReceiver = req.body?.notificationReceiver;
    const notificationMessage = req.body?.notificationMessage;

    if (!notificationReceiver || !notificationMessage){
        throw Error("Notification Receiver and Notification Message both are required!");
    }

    if (!notificationMessage.trim()){
        throw Error("Notification Message cannot be empty");
    }

    const newNotification = await Notification.create(
        {
            notificationReceiver,
            notificationMessage,
        }
    )

    if (!newNotification){
        throw Error("Couldn't create a new notification.");
    }

    res.status(200).json(
        {
            status: 200,
            message: "New notification created!",
            newNotification,
        }
    )

}


const deleteNotification = async(req, res) => {

    const loggedInUser = req.user;
    const notificationId = req.query?.notificationId;

    if (!notificationId || !notificationId.trim()){
        throw Error("Notification Id is required!");
    }

    const notification = await Notification.findById(notificationId);

    if (!notification){
        throw Error("Invalid notification Id!");
    }

    if (!notification.notificationReceiver.equals(loggedInUser._id)){
        throw("You are not authorized to delete this notification");
    }

    await notification.deleteOne();

    res.status(200).json(
        {
            status: 200,
            message: "Notification deleted successfully",

        }
    )

}


export {
    getNotifications,
    sendNotification,
    deleteNotification,
}