import PushNotification from "react-native-push-notification";
import { checkPermissions, requestPermission } from "./permissionUtil";

const REMINDER = 'reminder';
const POST_NOTIFICATIONS = 'POST_NOTIFICATIONS';
const NOTIFICATION = 'Notification';
const NOTIFICATION_TYPE_RENT = 'rent';
const NOTIFICATION_TYPE_MEMORY = 'memory';

const createChannel = () => {
    PushNotification.createChannel({
      channelId: REMINDER,
      channelName: 'Reminders'
    })
}

const addNotification = (channelId, title, message, id, type, date = new Date(Date.now()), hour = 9, minute = 0) => {
    date.setHours(hour, minute, 0, 0);
    
    checkPermissions((access) => {
        if(access) {
            const uniqueId = `${type}_${id}`;
            
            const notificationObj = {
                id: uniqueId,
                title,
                message,
                date,
                channelId,
                allowWhileIdle: true,
                playSound: true
            };
            
            PushNotification.localNotificationSchedule(notificationObj);
        } else {
            requestPermission(POST_NOTIFICATIONS, NOTIFICATION);
        }
    });
}
const addReminder = (title, message, id, date, type = 'reminder', hour = 9, minute = 0) => {
    addNotification(REMINDER, title, message, id, type, date, hour, minute);
}

const getScheduledNotifications = (callback) => {
    PushNotification.getScheduledLocalNotifications(callback);
}

const cancelNotification = (id, type) => {
    const notificationId = type ? `${type}_${id}` : id;
    PushNotification.cancelLocalNotification(notificationId);
}

const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
}

export {
    createChannel, 
    addNotification, 
    addReminder, 
    getScheduledNotifications, 
    cancelNotification, 
    cancelAllNotifications,
    NOTIFICATION_TYPE_RENT,
    NOTIFICATION_TYPE_MEMORY
}