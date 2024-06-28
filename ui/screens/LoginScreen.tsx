import * as React from 'react';
import { Text, View, TouchableHighlight, Alert, Image } from 'react-native';
import Styles from '../StyleSheet';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {insertOrUpdate, setUserId} from '../utils/firestoreBroker';

async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  await GoogleSignin.signIn().then(({idToken})=>{
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    auth().signInWithCredential(googleCredential).then((obj) => {
      const {user, user: {displayName, email, uid}} = obj;
      insertOrUpdate('Users', {displayName, email, userId: uid, time: new Date().getTime()}, uid);
      setUserId(uid);
    }).catch(err => console.log(err));
  }).catch((error)=>{
    Alert.alert('Google Siginin Error -> ' + error);
    console.log('Google Siginin Error -> ' + error);
  });
}

function GoogleSignInButton() {
    return (
      <View
      style={Styles.loginContainer}
      >
        <Text
        style={Styles.appName}>
          Daily
        </Text>
        <Text
        style={Styles.appDescription}>
          Manages daily routine
        </Text>
        <Image
        style={Styles.signInImage}
        source={require('../images/signIn.png')}
        />
        <TouchableHighlight
        style={Styles.signInButton}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => onGoogleButtonPress().then(() => {console.log('Signed in with Google!');})}
        >
          <Text style={Styles.signInText}>Google Sign-In</Text>
        </TouchableHighlight>
      </View>
    );
  }
export default function(){
    return (
      <GoogleSignInButton />
    )
}