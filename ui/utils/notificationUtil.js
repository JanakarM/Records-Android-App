import PushNotification from "react-native-push-notification";
import { checkPermissions, requestPermission } from "./permissionUtil";

const REMINDER = 'reminder';
const POST_NOTIFICATIONS = 'POST_NOTIFICATIONS';
const NOFTIFICATION = 'Notification';

const createChannel = () => {
    PushNotification.createChannel({
      channelId: REMINDER,
      channelName: 'Reminders'
    },
    (created) => console.log(`createChannel returned '${created}'`))
}

const addNotification = (channelId, title, message, id, date = new Date(Date.now() + 2 * 1000)) => {
    checkPermissions((access) => {
        if(access) {
        PushNotification.localNotificationSchedule({
            channelId,
            title,
            message,
            date,
            id
        });
        } else {
            requestPermission(POST_NOTIFICATIONS, NOFTIFICATION);
        }
    });
}
const addReminder = (title, message, id, date) => {
    addNotification(REMINDER, title, message, id, date);
}
export {createChannel, addNotification, addReminder}