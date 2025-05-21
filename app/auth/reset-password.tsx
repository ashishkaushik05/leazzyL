import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import CircularGradient from '@/components/CircularGradient';

export default function ResetPassword() {
  const params = useLocalSearchParams();
  const { actionCode, email } = params;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState('');

  // Verify the password reset code is valid
  useEffect(() => {
    const verifyCode = async () => {
      if (!actionCode) {
        setVerificationError('No action code provided');
        setIsVerifying(false);
        return;
      }

      try {
        // Verify the password reset code
        await verifyPasswordResetCode(auth, actionCode as string);
        setIsVerifying(false);
      } catch (error: any) {
        console.error('Error verifying reset code:', error);
        setVerificationError('This reset link is invalid or has expired. Please request a new password reset.');
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [actionCode]);

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    const isValid = 
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar;

    return isValid;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 'Very Weak';
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) strength += 1;

    switch (strength) {
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Medium';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return 'Very Weak';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Weak': return '#ff4d4d';
      case 'Weak': return '#ffcc00';
      case 'Medium': return '#ffcc00';
      case 'Strong': return '#66cc33';
      case 'Very Strong': return '#33cc33';
      default: return '#ff4d4d';
    }
  };

  const handleResetPassword = async () => {
    // Password validation
    if (!validatePassword(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Confirm passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Reset the password using the action code
      await confirmPasswordReset(auth, actionCode as string, password);
      
      // Show success message
      Alert.alert(
        'Password Reset',
        'Your password has been reset successfully. Please login with your new password.',
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error resetting password:', error);
      Alert.alert(
        'Error',
        'Failed to reset password. The link may have expired. Please try requesting a new password reset.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColor = getStrengthColor(passwordStrength);

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <CircularGradient />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9370db" />
          <Text style={styles.loadingText}>Verifying reset link...</Text>
        </View>
      </View>
    );
  }

  if (verificationError) {
    return (
      <View style={styles.container}>
        <CircularGradient />
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={60} color="#ff4d4d" />
          <Text style={styles.errorTitle}>Link Invalid</Text>
          <Text style={styles.errorMessage}>{verificationError}</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <CircularGradient />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Create a new password for {email}</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Create new password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {password.length > 0 && (
          <>
            <View style={styles.strengthBarContainer}>
              <View style={[styles.strengthBar, { 
                backgroundColor: strengthColor, 
                width: `${(password.length > 0 ? 
                  getPasswordStrength(password).split(' ')[0] === 'Very' ? 
                    (getPasswordStrength(password).split(' ')[1] === 'Weak' ? 20 : 100) : 
                    getPasswordStrength(password) === 'Weak' ? 40 : 
                    getPasswordStrength(password) === 'Medium' ? 60 : 
                    getPasswordStrength(password) === 'Strong' ? 80 : 0 : 0)}%` 
              }]} />
            </View>
            <Text style={[styles.strengthText, { color: strengthColor }]}>{passwordStrength}</Text>
            <Text style={styles.passwordRequirements}>
              Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.
            </Text>
          </>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {confirmPassword.length > 0 && password !== confirmPassword && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        <TouchableOpacity 
          style={[
            styles.resetButton, 
            (isLoading || !password || !confirmPassword || password !== confirmPassword) && styles.disabledButton
          ]} 
          onPress={handleResetPassword}
          disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorMessage: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#9370db',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
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
    fontSize: 20,
    color: 'white',
    marginBottom: 30,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    padding: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    marginBottom: 8,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    marginBottom: 8,
    fontSize: 14,
  },
  passwordRequirements: {
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginBottom: 15,
  },
  resetButton: {
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
