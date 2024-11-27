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
  const userProfile = <Image
    style={{width: 30, height: 30, borderRadius: 100}}  // required Dimensions and styling of Image
    src={auth().currentUser?.photoURL} // enter your avatar image path 
   />;
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
      <NavigationContainer>
        <Stack.Navigator>
          {Screen('Home', {title: 'Home'}, HomeScreen)}
          {Screen('ManageCan', {title: 'Manage Water Cans'}, ManageCanScreen)}
          {Screen('Recall', {title: 'Manage Memories'}, RecallScreen)}
          {Screen('ChitFund', {title: 'Manage Chit Funds'}, ChitFundScreen)}
          {Screen('ChitFundTransaction', {}, ChitFundTransactionScreen, (route) => {console.log('Check title - ' + route.params.chitFund.name); return route.params.chitFund.name;})}
          {Screen('ViewProfile', {title: 'View User Profile'}, ViewProfileScreen)}
          {Screen('ShareData', {title: 'Share Data'}, ShareScreen)}
          {Screen('SwitchOrg', {title: 'Switch Org'}, SwitchOrgScreen)}
          {Screen('CreateRent', {title: 'Create Rent'}, CreateRentScreen)}
          {Screen('ListRent', {title: 'Rent List'}, ListRentScreen)}
          {Screen('EditRent',  {}, EditRentScreen, (route) => {console.log('Check title - ' + route.params.rent.name); return route.params.rent.name;})}
          {Screen('ListRentTransaction', {}, ListRentTransactionScreen, (route) => route.params.rent.name)}
          {Screen('CreateRentTransaction', {}, CreateRentTransactionScreen, (route) => route.params.rent.name)}
          {Screen('EditRentTransaction', {}, EditRentTransactionScreen, ({params:{rentTransaction:{time, rentName}}}) => rentName + '  -- ' + new Date(time).toDateString())}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
    
  )
};

export default MyStack;