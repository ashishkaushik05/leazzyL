import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { auth } from '@/firebaseConfig';
import * as SecureStore from 'expo-secure-store';
import React from 'react';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // Check for any existing auth token and validate it
    const checkAuthToken = async () => {
      try {
        // If Firebase has already authenticated the user, we're good
        if (auth.currentUser) {
          setIsCheckingToken(false);
          return;
        }

        // Otherwise, check if we have a token in secure storage
        const authToken = await SecureStore.getItemAsync('authToken');
        if (!authToken) {
          setIsCheckingToken(false);
          return;
        }

        // If we have a token, Firebase will automatically use it on initialization
        // No need to manually handle it here as the onAuthStateChanged will fire
        
      } catch (error) {
        console.error('Error checking auth token:', error);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkAuthToken();
  }, []);

  // Log authentication state for debugging
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, isLoading, user, isCheckingToken });
  }, [isAuthenticated, isLoading, user, isCheckingToken]);

  // Show loading spinner while checking authentication
  if (isLoading || isCheckingToken) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9370db" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication state
  if (isAuthenticated && user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  text: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
});