import * as React from 'react';
import { Text, Button, SafeAreaView, FlatList, View, TouchableHighlight, Alert, Image } from 'react-native';
import Styles from '../StyleSheet';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  await GoogleSignin.signIn().then(({idToken})=>{
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log('Id Token -> ' + idToken)
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }).catch((error)=>{
    Alert.alert('Google Siginin Error -> ' + error)
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
        onPress={() => onGoogleButtonPress().then((assertion) => {console.log('Signed in with Google!');})}
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