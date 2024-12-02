import { Alert, PermissionsAndroid } from "react-native";
import PushNotification from "react-native-push-notification";

const requestPermission = async (permissionId, feature) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS[permissionId],
        {
          title: `Daily App ${feature} Permission`,
          message: `Daily App needs access to your ${feature}`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        Alert.alert(`Pleas provide ${feature} access from the settings`);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const checkPermissions = (callBack) => PushNotification.checkPermissions(({alert}) => {
    callBack(alert);
  })

  export {requestPermission, checkPermissions}