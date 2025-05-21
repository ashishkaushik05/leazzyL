import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import CircularGradient from '@/components/CircularGradient';
import OTPInput from '@/components/OTPInput';

export default function EmailOTPVerification() {
  const params = useLocalSearchParams();
  const { email } = params;
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const { signIn } = useAuth();

  // Timer for OTP resend
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

  // Handle OTP verification
  const handleVerification = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      // Since Firebase doesn't have a direct API for email OTP verification,
      // we would typically implement our own server-side verification
      // For now, we'll simulate the verification process
      
      // Would typically call API: verifyEmailOTP(email, otp)
      
      // If verification is successful, create the user account or sign them in
      const userCredential = await createUserWithEmailAndPassword(auth, email as string, "temporary-password");
      await updateProfile(userCredential.user, {
        displayName: email as string,
      });
      
      // Sign in through context
      signIn(userCredential.user);
      
      // Navigate to complete profile or set password
      router.replace('/auth/set-password');
    } catch (error: any) {
      let message = 'Failed to verify code. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        message = 'Invalid verification code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        message = 'Verification code has expired. Please request a new one.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
        router.replace('/auth/login');
      }
      
      Alert.alert('Verification Failed', message);
      console.error('Email verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      
      // Would typically call API to resend OTP: resendEmailOTP(email)
      
      // Reset timer for new OTP
      setTimeLeft(60);
      setResendDisabled(true);
      
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to resend verification code.');
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
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

      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {email}
      </Text>

      <View style={styles.form}>
        <OTPInput 
          value={otp}
          setValue={setOtp}
          onComplete={(code) => {
            if (code.length === 6) {
              handleVerification();
            }
          }}
        />

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {resendDisabled ? `Resend code in ${timeLeft}s` : 'You can now resend the code'}
          </Text>
          <TouchableOpacity 
            disabled={resendDisabled || isLoading}
            onPress={handleResendOTP}
            style={[styles.resendButton, (resendDisabled || isLoading) && styles.disabledButton]}
          >
            <Text style={[styles.resendButtonText, (resendDisabled || isLoading) && styles.disabledButtonText]}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.verifyButton, (otp.length !== 6 || isLoading) && styles.disabledButton]} 
          onPress={handleVerification}
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
  },
  form: {
    flex: 1,
  },
  otpInput: {
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 10,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    color: '#999',
    fontSize: 14,
  },
  resendButton: {
    padding: 10,
  },
  resendButtonText: {
    color: '#9370db',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#9370db',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#4d3d69',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#777',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
