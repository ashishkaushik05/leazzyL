import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { applyActionCode, checkActionCode, confirmPasswordReset, verifyPasswordResetCode, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import CircularGradient from '@/components/CircularGradient';

export default function EmailVerification() {
  const params = useLocalSearchParams();
  const { email, mode, actionCode } = params;
  
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const { user, signIn, refreshUser } = useAuth();
  
  // Check if the current user's email is verified
  useEffect(() => {
    // Only check verification status if we have a signed-in user
    if (user && user.email) {
      const checkVerificationStatus = async () => {
        const isVerified = await refreshUser();
        if (isVerified) {
          setVerificationStatus('success');
        }
      };
      
      checkVerificationStatus();
      
      // Check verification status periodically
      const interval = setInterval(checkVerificationStatus, 3000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Timer for resend
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle action code if provided (from email link)
  useEffect(() => {
    if (actionCode) {
      handleActionCode(actionCode as string, mode as string);
    }
  }, [actionCode, mode]);

  const handleActionCode = async (actionCode: string, mode?: string) => {
    setIsLoading(true);
    try {
      // Check what type of action is being performed
      switch (mode) {
        case 'verifyEmail':
          // Apply the email verification code
          await applyActionCode(auth, actionCode);
          setVerificationStatus('success');
          break;
          
        case 'resetPassword':
          // Verify the password reset code is valid
          await verifyPasswordResetCode(auth, actionCode);
          // Navigate to password reset screen with the action code
          router.replace({
            pathname: '/auth/reset-password',
            params: { actionCode }
          });
          break;
          
        default:
          // Just verify the action code is valid
          await checkActionCode(auth, actionCode);
          setVerificationStatus('success');
      }
    } catch (error) {
      console.error('Action code error:', error);
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to verify your email.');
      return;
    }
    
    setIsLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      
      // Reset timer for new email
      setTimeLeft(60);
      setResendDisabled(true);
      
      Alert.alert('Success', 'A new verification email has been sent.');
    } catch (error: any) {
      let message = 'Failed to send verification email. Please try again.';
      
      if (error.code === 'auth/too-many-requests') {
        message = 'Too many verification attempts. Please try again later.';
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Render different states based on verification status
  const renderContent = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <View style={styles.statusContainer}>
            <FontAwesome name="check-circle" size={60} color="#4caf50" />
            <Text style={styles.statusTitle}>Email Verified!</Text>
            <Text style={styles.statusMessage}>
              Your email has been successfully verified. You can now continue using the app.
            </Text>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => {
                // Update auth state with user to make sure it has emailVerified=true
                if (auth.currentUser) {
                  signIn(auth.currentUser);
                } else {
                  router.replace('/(tabs)');
                }
              }}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'error':
        return (
          <View style={styles.statusContainer}>
            <FontAwesome name="times-circle" size={60} color="#f44336" />
            <Text style={styles.statusTitle}>Verification Failed</Text>
            <Text style={styles.statusMessage}>
              We couldn't verify your email. The link may have expired or already been used.
            </Text>
            <TouchableOpacity 
              style={styles.resendFullButton}
              onPress={handleResendVerification}
              disabled={resendDisabled || isLoading}
            >
              <Text style={styles.buttonText}>
                {resendDisabled ? `Resend in ${timeLeft}s` : 'Resend Verification'}
              </Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification link to {email}
            </Text>
            <Text style={styles.instructions}>
              Please check your inbox and click the verification link to verify your email address.
              If you don't see the email, check your spam folder.
            </Text>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {resendDisabled ? `Resend verification in ${timeLeft}s` : 'You can now resend the verification'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.resendFullButton, (resendDisabled || isLoading) && styles.disabledButton]}
              onPress={handleResendVerification}
              disabled={resendDisabled || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Resend Verification</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => {
                Alert.alert(
                  'Email Verification Required',
                  'Please verify your email to unlock all features. Would you like to continue without verification?',
                  [
                    {
                      text: 'Continue verifying',
                      style: 'cancel'
                    },
                    {
                      text: 'Continue without verification',
                      style: 'destructive',
                      onPress: () => {
                        if (auth.currentUser) {
                          router.replace('/(tabs)');
                        } else {
                          router.replace('/auth/login');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.buttonText}>Continue without verification</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <CircularGradient />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      {renderContent()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  instructions: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 30,
    lineHeight: 20,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  statusMessage: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    color: '#999',
    fontSize: 14,
  },
  resendFullButton: {
    backgroundColor: '#9370db',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: '#2c2c2c',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#4d3d69',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
