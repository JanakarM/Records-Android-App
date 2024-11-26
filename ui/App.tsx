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
import RentTransactionScreen from './screens/ListRentTransactionScreen';

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
  const Screen = (name, options, comp) => <Stack.Screen name={name} component={comp} options={({navigation}) => ({...options, headerRight: () => (
    <View style={{flexDirection: 'row', gap: 10}}>
      <ProfileMenu photoUrl={auth().currentUser?.photoURL} nav={navigation} signOut={signOut}/>
    </View>
  )})}/>;

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
          {Screen('ChitFundTransaction', ({route}) => ({title: route.params.chitFund.name}), ChitFundTransactionScreen)}
          {Screen('ViewProfile', {title: 'View User Profile'}, ViewProfileScreen)}
          {Screen('ShareData', {title: 'Share Data'}, ShareScreen)}
          {Screen('SwitchOrg', {title: 'Switch Org'}, SwitchOrgScreen)}
          {Screen('CreateRent', {title: 'Create Rent'}, CreateRentScreen)}
          {Screen('ListRent', {title: 'Rent List'}, ListRentScreen)}
          {Screen('RentTransaction',  ({route}) => ({title: route.params.rent.name}), RentTransactionScreen)}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
    
  )
};

export default MyStack;