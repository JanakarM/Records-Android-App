import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ManageCanScreen from './screens/ManageWaterCanScreen';
import Styles from './StyleSheet';
import LoginScreen from './screens/LoginScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import RecallScreen from './screens/RecallScreen';

const Stack = createNativeStackNavigator();
  
const MyStack = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Stack.Screen name="ManageCan" component={ManageCanScreen} options={{title: 'Manage Water Can'}}/>
      <Stack.Screen name="Recall" component={RecallScreen} options={{title: 'Recall'}}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
};

export default MyStack;

/*
<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen name="ManageCan" component={ManageCanScreen} options={{title: 'Manage Water Can'}}/>
      </Stack.Navigator>
    </NavigationContainer>
*/