import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import CircularGradient from '@/components/CircularGradient';
import { useAuth } from '@/contexts/AuthContext';

// Styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PersonalInformationScreen() {
  const { user } = useAuth();

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <CircularGradient />
      
      {/* Header */}
      <StyledView className="bg-transparent flex-row items-center px-5 pb-4 pt-3">
        <StyledTouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mr-4">
          <FontAwesome name="chevron-left" size={18} color="#fff" />
        </StyledTouchableOpacity>
        <StyledText className="text-white text-3xl font-bold">Personal info</StyledText>
      </StyledView>
      
      <StyledView className="bg-transparent flex-1 px-5 mt-5">
        {/* First Name */}
        <StyledTouchableOpacity 
          onPress={() => router.push('/profileOptions/edit-name')}
          className="bg-zinc-800 rounded-xl mb-4 p-4">
          <StyledText className="text-gray-400 text-sm">First name on ID</StyledText>
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-white text-xl">{user?.displayName ? user.displayName : ''}</StyledText>
            <FontAwesome name="pencil" size={18} color="#7e7e7e" />
          </StyledView>
        </StyledTouchableOpacity>
        
        {/* Date of Birth */}
        <StyledTouchableOpacity 
          onPress={() => router.push('/profileOptions/edit-dob')}
          className="bg-zinc-800 rounded-xl mb-4 p-4">
          <StyledText className="text-gray-400 text-sm">Date of Birth</StyledText>
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-white text-xl">Aug 5, 2002</StyledText>
            <FontAwesome name="pencil" size={18} color="#7e7e7e" />
          </StyledView>
        </StyledTouchableOpacity>
        
        {/* Phone Number */}
        <StyledTouchableOpacity 
          onPress={() => router.push('/profileOptions/edit-phone')}
          className="bg-zinc-800 rounded-xl mb-4 p-4">
          <StyledText className="text-gray-400 text-sm">Phone number</StyledText>
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-white text-xl">{user?.phone || 'Not set'}</StyledText>
            <FontAwesome name="pencil" size={18} color="#7e7e7e" />
          </StyledView>
        </StyledTouchableOpacity>
        
        {/* Email */}
        <StyledTouchableOpacity 
          onPress={() => router.push('/profileOptions/edit-email')}
          className="bg-zinc-800 rounded-xl mb-4 p-4">
          <StyledText className="text-gray-400 text-sm">Email ID</StyledText>
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-white text-xl">{user?.email || 'Not set'}</StyledText>
            <FontAwesome name="pencil" size={18} color="#7e7e7e" />
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
}