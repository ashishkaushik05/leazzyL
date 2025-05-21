import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function SetPassword() {
  const params = useLocalSearchParams();
  const { firstName, lastName, email, birthDate } = params;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn } = useAuth();

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

  const handleCreateAccount = async () => {
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

    try {
      // Create user in Firebase with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email as string, 
        password
      );
      
      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // You could store additional user data in Firestore/database here
      // e.g., birthDate, etc.

      // Sign in the user through context
      signIn(userCredential.user);
      
      // Navigate to home screen or onboarding
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Account Exists',
          'You already have an account. Please login.',
          [
            {
              text: 'Go to Login',
              onPress: () => router.replace('/auth/login'),
            },
          ],
        );
      } else {
        Alert.alert('Error', error.message || 'Something went wrong.');
      }
      console.error('Error creating user:', error);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColor = getStrengthColor(passwordStrength);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Set Password</Text>
      <Text style={styles.subtitle}>Create a secure password</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Create password"
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
              <View style={[styles.strengthBar, { backgroundColor: strengthColor, width: `${(password.length > 0 ? getPasswordStrength(password).split(' ')[0] === 'Very' ? (getPasswordStrength(password).split(' ')[1] === 'Weak' ? 20 : 100) : getPasswordStrength(password) === 'Weak' ? 40 : getPasswordStrength(password) === 'Medium' ? 60 : getPasswordStrength(password) === 'Strong' ? 80 : 0 : 0)}%` }]} />
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
            placeholder="Confirm password"
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
            styles.createButton, 
            (!password || !confirmPassword || password !== confirmPassword) && styles.disabledButton
          ]} 
          onPress={handleCreateAccount}
          disabled={!password || !confirmPassword || password !== confirmPassword}
        >
          <Text style={styles.buttonText}>Create Account</Text>
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
  createButton: {
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
