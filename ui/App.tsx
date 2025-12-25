import React, {useEffect, useState} from 'react';
import { Image, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ManageCanScreen from './screens/ManageWaterCanScreen';
import LoginScreen from './screens/LoginScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import ProfileMenu from './components/ProfileMenu';
import RecallScreen from './screens/MemoryScreen';
import ChitFundScreen from './screens/ChitFundScreen';
import ChitFundTransactionScreen from './screens/ChitFundTransactionScreen';
import { MenuProvider } from 'react-native-popup-menu';
import ViewProfileScreen from './screens/ViewProfileScreen';
import ShareScreen from './screens/ShareScreen';
import SwitchOrgScreen from './screens/SwitchOrgScreen';
import CreateRentScreen from './screens/CreateRentScreen';
import ListRentScreen from './screens/ListRentScreen';
import ListRentTransactionScreen from './screens/ListRentTransactionScreen';
import EditRentScreen from './screens/EditRentScreen';
import CreateRentTransactionScreen from './screens/CreateRentTransactionScreen';
import EditRentTransactionScreen from './screens/EditRentTransactionScreen';
import DateCalculatorScreen from './screens/DateCalculatorScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ListBillsScreen from './screens/ListBillsScreen';
import CreateBillScreen from './screens/CreateBillScreen';
import EditBillScreen from './screens/EditBillScreen';
import { getBillTypeConfig } from './config/billTypes';
import { createChannel } from './utils/notificationUtil';

export const navigationRef = React.createRef();

const Stack = createNativeStackNavigator();

const MyStack = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const signOut = () => {
    GoogleSignin.signOut().then(() => {
      auth().signOut();
      console.log('signed out');
      setUser(undefined);
    });
  };
  const Screen = (name, options, comp, getTitle) => <Stack.Screen name={name} component={comp} options={({navigation, route}) => {
    let opts = {...options, headerRight: () => (
      <View style={{flexDirection: 'row', gap: 10}}>
        <ProfileMenu photoUrl={auth().currentUser?.photoURL} nav={navigation} signOut={signOut}/>
      </View>
      )};
      if(getTitle != null) {
        opts.title = getTitle(route);
      }
      return opts;
    }}
  />;

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '579486122496-iu2als4634td3ebr9mrsh89q0m221gbd.apps.googleusercontent.com',
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    createChannel();
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if(!user){
    return (
      <LoginScreen />
    )
  }
  return (
    <MenuProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          {Screen('Home', {title: 'Home'}, HomeScreen)}
          {Screen('ManageCan', {title: 'Manage Water Cans'}, ManageCanScreen)}
          {Screen('Recall', {title: 'Manage Memories'}, RecallScreen)}
          {Screen('ChitFund', {title: 'Manage Chit Funds'}, ChitFundScreen)}
          {Screen('ChitFundTransaction', {}, ChitFundTransactionScreen, (route) => route.params.chitFund.name)}
          {Screen('ViewProfile', {title: 'View User Profile'}, ViewProfileScreen)}
          {Screen('Notifications', {title: 'Manage Notifications'}, NotificationsScreen, null)}
          {Screen('ShareData', {title: 'Share Data'}, ShareScreen)}
          {Screen('SwitchOrg', {title: 'Switch Org'}, SwitchOrgScreen)}
          {Screen('CreateRent', {title: 'Create Rent'}, CreateRentScreen)}
          {Screen('ListRent', {title: 'Rent List'}, ListRentScreen)}
          {Screen('EditRent',  {}, EditRentScreen, (route) => route.params.rent.name)}
          {Screen('ListRentTransaction', {}, ListRentTransactionScreen, (route) => route.params.rent.name)}
          {Screen('CreateRentTransaction', {}, CreateRentTransactionScreen, (route) => `${route.params.rent.name} - Pay due`)}
          {Screen('EditRentTransaction', {}, EditRentTransactionScreen, ({params:{rentTransaction:{time, rent:{name: rentName}}}}) =>  new Date(time).toLocaleDateString('en-us', { year: 'numeric', month: 'short' }) + ' - ' + rentName)}
          {Screen('DateCalculator', {title: 'Date Calculator'}, DateCalculatorScreen)}
          {Screen('ListBills', {}, ListBillsScreen, (route) => getBillTypeConfig(route.params.billType)?.label || 'Bills')}
          {Screen('CreateBill', {}, CreateBillScreen, (route) => `Add ${getBillTypeConfig(route.params.billType)?.label || 'Bill'}`)}
          {Screen('EditBill', {}, EditBillScreen, (route) => `Edit ${getBillTypeConfig(route.params.billType)?.label || 'Bill'}`)}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
    
  )
};

export default MyStack;