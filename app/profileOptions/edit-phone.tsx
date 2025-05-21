import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import CircularGradient from '@/components/CircularGradient';
import { useAuth } from '@/contexts/AuthContext';

// Styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function EditPhoneScreen() {
  const { user, updateUserProfile, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');

  const handleSave = async () => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to update your profile');
        return;
      }
      
      // Send verification code to the phone number
      const { sendPhoneVerification } = useAuth();
      const verificationId = await sendPhoneVerification(phoneNumber);
      
      // Navigate to verification screen
      router.push({
        pathname: '/auth/phone-verification',
        params: { 
          phoneNumber,
          verificationId
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code to phone number');
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <CircularGradient />
      
      {/* Header */}
      <StyledView className="bg-transparent flex-row items-center justify-between px-5 py-3">
        <StyledTouchableOpacity onPress={() => router.back()}>
          <StyledText className="text-white text-lg">Close</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      
      <StyledView className="bg-transparent flex-1 px-5">
        <StyledText className="text-white text-4xl font-bold mb-8">Phone number</StyledText>
        
        {/* Phone Number Input */}
        <StyledView className="bg-zinc-800 rounded-xl p-4 mb-4">
          <StyledText className="text-gray-400 text-sm mb-1">Phone number</StyledText>
          <StyledTextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            className="text-white text-xl p-0"
            placeholderTextColor="#7e7e7e"
            keyboardType="phone-pad"
          />
        </StyledView>
        
        <StyledText className="text-gray-400 text-sm mb-8">
          We'll send a verification code to this number. Standard message and data rates may apply.
        </StyledText>
        
        {/* Save Button */}
        <StyledTouchableOpacity
          onPress={handleSave}
          disabled={isLoading || phoneNumber.length < 10}
          className={`bg-purple-500 rounded-full p-4 items-center ${(isLoading || phoneNumber.length < 10) ? 'opacity-70' : ''}`}
          style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}
        >
          <StyledText className="text-white text-xl font-semibold">Save</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
}
