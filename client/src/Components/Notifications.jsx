import React, { useState, useEffect } from 'react'
import { IoIosNotifications } from "react-icons/io";
import axios from 'axios';
import conf from "../config/config.js";
import { showAcceptToast, showErrorToast } from '../Utils/toastUtils.js';

function Notifications() {

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (notifications?.length > 0) {
            setSelected(new Array(notifications.length).fill(false));
        }
    }, [notifications]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                `${conf.serverUrl}/api/v1/notification/getNotifications`,
                {
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    withCredentials: true,
                }
            );
            setNotifications(response.data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            showErrorToast("Failed to fetch notifications");
        }
    };

    const handleDeleteNotifications = async () => {
        // Check if selected array exists and has any selected items
        if (!selected || !Array.isArray(selected)) {
            showErrorToast("No notifications selected");
            return;
        }
        
        const selectedNotifications = selected.filter(item => item === true);
        if (selectedNotifications.length === 0) {
            showErrorToast("Please select at least one notification");
            return;
        }
        
        try {
            // Process all selected notifications
            const promises = [];
            for (let i = 0; i < selected.length; i++) {
                if (selected[i]) {
                    const notificationId = notifications[i]._id;
                    console.log(`Deleting notification: ${notificationId}`);
                    
                    const promise = axios.delete(
                        `${conf.serverUrl}/api/v1/notification/deleteNotification?notificationId=${notificationId}`,
                        {
                            headers: { 
                                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                            },
                            withCredentials: true,
                        }
                    )
                    .then(() => {
                        console.log(`Notification deleted: ${notificationId}`);
                    })
                    .catch((error) => {
                        console.log(`Failed to delete notification: ${notificationId}`);
                    });
                    promises.push(promise);
                }
            }
            
            // Wait for all requests to complete
            const results = await Promise.all(promises);
            console.log("All notifications processed:", results);
            showAcceptToast("Notifications deleted successfully");
            
            // Refresh notifications
            await fetchNotifications();
            
        } catch (error) {
            console.error("Error deleting notifications:", error);
            showErrorToast("Failed to delete some notifications");
        }
    };

    const toggleCheckbox = (index) => {
        const newSelected = [...selected];
        newSelected[index] = !newSelected[index];
        setSelected(newSelected);
    };

    return (
        <div className="flex justify-end">
            <div className="relative">
                <IoIosNotifications className="h-[30px] w-[30px] rounded-full cursor-pointer"
                    onClick={() => setShowNotifications((prev) => !prev)}
                />
                {notifications?.length > 0 && (
                    <div className='flex justify-center items-center rounded-full absolute h-[15px] w-[15px] bg-red-500 text-white -translate-1/2 text-sm' 
                         style={{top: `${15 + 15*Math.sin(Math.PI/4)}px`, left: `${15 + 15*Math.cos(Math.PI/4)}px`}}>
                        {notifications.length}
                    </div>
                )}
                {showNotifications && (
                    <div className="flex flex-col absolute top-10 right-0 w-[300px] h-[400px] bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-y-scroll overflow-x-hidden">
                        <div className="w-full flex-grow p-2">
                            {notifications?.length === 0 ? (
                                <div className='text-gray-400 text-center mt-4'>No Notifications</div>
                            ) : (
                                <>
                                    {notifications?.map((notification, notificationIndex) => (
                                        <div className="flex items-start w-full bg-gray-50 p-3 gap-2 mb-2 rounded border" 
                                             key={notification._id}>
                                            <input 
                                                type="checkbox" 
                                                checked={selected?.[notificationIndex] || false} 
                                                onChange={() => toggleCheckbox(notificationIndex)}
                                                className="mt-1"
                                            />
                                            <div className="text-sm flex-grow">
                                                <div className="text-gray-800 mb-1">
                                                    {notification.notificationMessage}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        {notifications?.length > 0 && (
                            <div className='w-full p-2 border-t bg-gray-50'>
                                <button 
                                    className='w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors'
                                    onClick={handleDeleteNotifications}
                                >
                                    Delete Selected
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notifications