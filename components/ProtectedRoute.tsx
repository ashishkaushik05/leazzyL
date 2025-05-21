import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

/**
 * A component that protects routes by requiring authentication
 * Redirects to the login page if the user is not authenticated
 * Can also enforce email verification when requireEmailVerification is true
 */
export function ProtectedRoute({ children, requireEmailVerification = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login
      router.replace('/auth/login');
    } else if (requireEmailVerification && user?.email && !user.emailVerified) {
      // User is authenticated but email is not verified
      router.push({
        pathname: '/auth/email-verification',
        params: { email: user.email }
      });
    }
  }, [isAuthenticated, isLoading, user?.emailVerified, requireEmailVerification]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9370db" />
      </View>
    );
  }

  // Only render children if authenticated and (email verified or verification not required)
  const shouldRender = isAuthenticated && 
    (!requireEmailVerification || !user?.email || user.emailVerified);
  
  return shouldRender ? <>{children}</> : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
});
