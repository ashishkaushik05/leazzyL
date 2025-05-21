import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { 
  signInWithPhoneNumber, 
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { AppleAuthenticationScope, signInAsync } from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Initialize GoogleSignin with proper configuration
GoogleSignin.configure({
  // Use web client ID from google-services.json
  webClientId: '22015092534-sge42adqfjq916u3jcdik6em7fj4m4e7.apps.googleusercontent.com',
  // iOS specific config from GoogleService-Info.plist
  iosClientId: Platform.OS === 'ios' ? '22015092534-9tgolmu1seahefn7e399upvpn6b4jdq2.apps.googleusercontent.com' : undefined,
  // Important for Android login
  offlineAccess: false,
  scopes: ['profile', 'email']
});

// Enable WebBrowser debug mode for iOS
if (Platform.OS === 'ios') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // For iOS, use Expo Auth Session
  const [_, googleResponse, googleSignInIOS] = Platform.OS === 'ios' 
    ? Google.useAuthRequest({
        iosClientId: '22015092534-9tgolmu1seahefn7e399upvpn6b4jdq2.apps.googleusercontent.com',
        webClientId: '22015092534-sge42adqfjq916u3jcdik6em7fj4m4e7.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      })
    : [null, null, () => {}]; // Empty implementation for Android
  
  // Native Google Sign In for Android
  const signInWithGoogleAndroid = async () => {
    try {
      console.log('Checking Google Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      console.log('Starting Google Sign In...');
      // First, make sure user is signed out to prevent stale sessions
      await GoogleSignin.signOut();
      
      // Sign in and get user info - add more debugging info
      console.log('Attempting to sign in with Google');
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In successful, response:', JSON.stringify(userInfo, null, 2));
      
      // Check structure of userInfo to locate the ID token
      let idToken = null;
      
      // Use type assertion to avoid TypeScript errors
      const response = userInfo as any;
      
      // Access the token correctly based on the response structure
      if (response.data && response.data.idToken) {
        // New response structure with data property (as seen in logs)
        idToken = response.data.idToken;
        console.log('Found idToken in response.data.idToken');
      } else if (response.idToken) {
        // Old structure with direct idToken property
        idToken = response.idToken;
        console.log('Found idToken in response.idToken');
      } else if (response.user && response.user.idToken) {
        // Alternative structure with user property
        idToken = response.user.idToken;
        console.log('Found idToken in response.user.idToken');
      }
      
      if (!idToken) {
        console.error('ID token not found in response structure:', response);
        throw new Error('No ID token received from Google');
      }
      
      console.log('Proceeding with Firebase auth using Google credentials');
      
      // Sign in with Firebase using the ID token
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      console.log('Firebase auth successful, signing in user');
      signIn(result.user);
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Native Google Sign In error:', error);
      
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Error', 'Sign in already in progress');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play services not available or outdated');
      } else if (error?.message && error.message.includes('DEVELOPER_ERROR')) {
        Alert.alert(
          'Configuration Error', 
          'There\'s an issue with the Google Sign-In configuration. Your SHA-1 fingerprint (5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25) needs to be registered in the Firebase console for package name "com.leazzy.app".'
        );
        console.error('DEVELOPER_ERROR details:', JSON.stringify(error, null, 2));
      } else {
        Alert.alert('Authentication Error', error?.message || 'An unknown error occurred');
      }
      
      setIsLoading(false);
    }
  };

  // This handles the Google Sign-In button press for both platforms
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    if (Platform.OS === 'android') {
      signInWithGoogleAndroid();
    } else {
      // iOS
      try {
        const result = googleSignInIOS();
        // If the result is a Promise, handle it appropriately
        if (result && typeof result.then === 'function') {
          result.catch((error: any) => {
            console.error("Error starting Google auth:", error);
            Alert.alert("Error", "Failed to start Google authentication");
            setIsLoading(false);
          });
        }
      } catch (error: any) {
        console.error("Error in googleSignInIOS:", error);
        Alert.alert("Error", "Failed to start Google authentication");
        setIsLoading(false);
      }
    }
  };

  // For iOS: Handle the response from the web flow
  React.useEffect(() => {
    if (Platform.OS !== 'ios' || !googleResponse) return;
    
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      console.log("Google auth success on iOS, got id_token");
      
      if (!id_token) {
        console.error('No ID token received from Google');
        Alert.alert('Authentication Error', 'Failed to get user info from Google');
        setIsLoading(false);
        return;
      }
      
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Firebase auth successful");
          signIn(result.user);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Google sign in error:', error);
          Alert.alert('Authentication Error', error.message || 'Failed to authenticate with Google');
          setIsLoading(false);
        });
    } else if (googleResponse?.type === 'error') {
      console.error('Google auth error:', googleResponse.error);
      Alert.alert('Google Sign In Error', googleResponse.error?.message || 'An error occurred during Google sign in');
      setIsLoading(false);
    } else if (googleResponse) {
      // Any other response type (cancel, etc)
      setIsLoading(false);
    }
  }, [googleResponse]);

  const handlePhoneSignIn = async () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed || !/^\+\d{10,15}$/.test(trimmed)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number with country code, e.g. +919999999999');
      return;
    }
    try {
      const confirmation = await signInWithPhoneNumber(auth, trimmed);
      setVerificationId(confirmation.verificationId);
      setIsVerifying(true);
    } catch (error: any) {
      let message = 'Something went wrong. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number. Please check and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many requests. Please try again later.';
      }
      Alert.alert('Phone sign in error', message);
      console.error('Phone sign in error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });
      // Handle successful Apple sign in
      console.log(credential);
    } catch (error) {
      console.error('Apple sign in error:', error);
    }
  };

  const handleEmailSignIn = () => {
    router.push('/auth/email-signin');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      
      <Text style={styles.title}>Log in or sign up</Text>

      {!isVerifying ? (
        <>
          <View style={styles.inputContainer}>           
             <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <TouchableOpacity style={styles.continueButton} onPress={handlePhoneSignIn}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity 
            style={[styles.socialButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
            onPress={() => {
              console.log("Initiating Google sign-in...");
              handleGoogleSignIn();
            }}
          >
            <FontAwesome name="google" size={20} color="white" />
            <Text style={styles.socialButtonText}>
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
              <FontAwesome name="apple" size={20} color="white" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.socialButton} onPress={handleEmailSignIn}>
            <FontAwesome name="envelope" size={20} color="white" />
            <Text style={styles.socialButtonText}>Continue with email</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text style={styles.verificationText}>
            Enter verification code sent to {phoneNumber}
          </Text>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter OTP"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          <TouchableOpacity style={styles.continueButton} onPress={() => {}}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },
  label: {
    color: 'white',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#9370db',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: '#1f1f1f',
  },
  socialButtonText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
  },
  verificationText: {
    color: 'white',
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 5,
  },
});
