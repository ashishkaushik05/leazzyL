import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function CompleteProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { signIn } = useAuth();

  const handleContinue = () => {
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Age validation - 18 years or older
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
    if (birthDate > eighteenYearsAgo) {
      Alert.alert('Age Restriction', 'You must be at least 18 years old to sign up');
      return;
    }

    // Navigate to set password screen with user profile information
    router.push({
      pathname: "/auth/set-password", 
      params: { 
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthDate: birthDate.toISOString()
      }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Confirm account</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
        />
        
        <Text style={styles.hint}>
          Make sure this name matches the name on your Adhaar card
        </Text>

        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {birthDate.toLocaleDateString() || 'Date of birth'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.hint}>
          To sign up, you need to be at least 18. Your birthdate won't be shared with anyone who use Leazzy
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your mail ID"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.termsText}>
          By filling all the information you Agree and continue to Leazzy{' '}
          <Text style={styles.link}>Terms of Service, Payments Terms of Service</Text>
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Agree and continue</Text>
          <FontAwesome name="arrow-right" size={20} color="white" />
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
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  dateText: {
    color: '#999',
    fontSize: 16,
  },
  hint: {
    color: '#999',
    marginBottom: 20,
    fontSize: 14,
  },
  termsText: {
    color: '#999',
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: '#9370db',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#9370db',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
});
