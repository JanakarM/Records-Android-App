import PushNotification from "react-native-push-notification";
import { checkPermissions, requestPermission } from "./permissionUtil";

const REMINDER = 'reminder';
const POST_NOTIFICATIONS = 'POST_NOTIFICATIONS';
const NOTIFICATION = 'Notification';

const createChannel = () => {
    PushNotification.createChannel({
      channelId: REMINDER,
      channelName: 'Reminders'
    },
    (created) => console.log(`createChannel returned '${created}'`))
}

const addNotification = (channelId, title, message, params, date = new Date(Date.now())) => {
    console.log(date);
    date.setHours(9, 0, 0, 0);
    console.log(date);
    checkPermissions((access) => {
        if(access) {
        PushNotification.localNotificationSchedule({
            channelId,
            title,
            message,
            date,
            allowWhileIdle: true,
            params
        });
        } else {
            requestPermission(POST_NOTIFICATIONS, NOTIFICATION);
        }
    });
}
const addReminder = (title, message, params, date) => {
    addNotification(REMINDER, title, message, params, date);
}

const getScheduledNotifications = (callback) => {
    PushNotification.getScheduledLocalNotifications(callback);
}

const cancelNotification = (id) => {
    PushNotification.cancelLocalNotification(id);
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
    cancelAllNotifications
}