/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './ui/App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";

AppRegistry.registerComponent(appName, () => App);

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    requestPermissions: true
});