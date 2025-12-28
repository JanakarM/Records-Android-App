import * as React from 'react';
import { Text, View, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { insertOrUpdate, setUserId } from '../data/DataBrokerProvider';
import Icon from 'react-native-vector-icons/FontAwesome';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
  google: '#4285F4',
  googleDark: '#3367D6',
};

export default function LoginScreen() {
  const [isLoading, setIsLoading] = React.useState(false);

  const onGoogleButtonPress = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);
      const { displayName, email, uid } = user;
      insertOrUpdate('Users', { displayName, email, userId: uid, time: Date.now() }, uid);
      setUserId(uid);
    } catch (error) {
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
      console.log('Google Sign-In Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Daily</Text>
        <Text style={styles.appDescription}>Manages daily routine</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          style={styles.signInImage}
          source={require('../images/signIn.png')}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
          activeOpacity={0.8}
          onPress={onGoogleButtonPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <View style={styles.googleIconWrap}>
                <Icon name="google" size={18} color={COLORS.google} />
              </View>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By signing in, you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  appDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInImage: {
    width: '80%',
    height: '80%',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.google,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    shadowColor: COLORS.google,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIconWrap: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 6,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 16,
    textAlign: 'center',
  },
});