/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App, {navigationRef} from './ui/App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";

AppRegistry.registerComponent(appName, () => App);

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      console.log(navigationRef.current);
      navigationRef.current.navigate('CreateRentTransaction', {rent: notification.params});
    },
    requestPermissions: true
});