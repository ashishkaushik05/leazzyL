import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
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

export default function EditNameScreen() {
  const { user, updateUserProfile, isLoading } = useAuth();
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ')[1] || '' : '');

  const handleSave = async () => {
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await updateUserProfile({ name: fullName });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
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
        <StyledText className="text-white text-4xl font-bold mb-8">Edit Name</StyledText>
        
        {/* First Name Input */}
        <StyledView className="bg-zinc-800 rounded-t-xl p-4 border-b border-zinc-700">
          <StyledText className="text-gray-400 text-sm mb-1">First name on ID</StyledText>
          <StyledTextInput
            value={firstName}
            onChangeText={setFirstName}
            className="text-white text-xl p-0"
            placeholderTextColor="#7e7e7e"
          />
        </StyledView>
        
        {/* Last Name Input */}
        <StyledView className="bg-zinc-800 rounded-b-xl p-4 mb-4">
          <StyledText className="text-gray-400 text-sm mb-1">First name on ID</StyledText>
          <StyledTextInput
            value={lastName}
            onChangeText={setLastName}
            className="text-white text-xl p-0"
            placeholderTextColor="#7e7e7e"
          />
        </StyledView>
        
        <StyledText className="text-gray-400 text-sm mb-8">
          Make sure this name matches the name on your Adhaar card
        </StyledText>
        
        {/* Save Button */}
        <StyledTouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className={`bg-purple-500 rounded-full p-4 items-center ${isLoading ? 'opacity-70' : ''}`}
          style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}
        >
          <StyledText className="text-white text-xl font-semibold">Save</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
}