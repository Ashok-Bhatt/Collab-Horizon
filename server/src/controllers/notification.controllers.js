import bodyParser from "body-parser"


const getNotifications = (req, res) => {

    

}


const sendNotification = (req, res) => {

    const loggedInUser = req.user;
    console.log(loggedInUser);

    return res;

}


const deleteNotifications = (req, res) => {

}


export {
    getNotifications,
    sendNotification,
    deleteNotifications,
}