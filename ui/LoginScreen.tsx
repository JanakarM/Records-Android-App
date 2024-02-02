import * as React from 'react';
import { Text, Button, SafeAreaView, FlatList, View, TouchableHighlight, Alert } from 'react-native';
import Styles from './StyleSheet';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  await GoogleSignin.signIn().then(({idToken})=>{
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    Alert.alert('Id Token -> ' + idToken)
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }).catch((error)=>{
    Alert.alert('Google Siginin Error -> ' + error)
  });
}
function GoogleSignInButton() {
    return (
      <TouchableHighlight
      style={Styles.signInButton}
      activeOpacity={0.6}
      underlayColor='lightgrey'
      onPress={() => onGoogleButtonPress().then(() => Alert.alert('Signed in with Google!'))}
      >
        <Text style={Styles.signInText}>Google Sign-In</Text>
      </TouchableHighlight>
    );
  }
export default function(){
    return (
        <View style={Styles.container}>
            <GoogleSignInButton />
        </View>
    )
}