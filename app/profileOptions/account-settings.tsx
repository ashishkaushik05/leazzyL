import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
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

export default function AccountSettingsScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Sign Out",
          onPress: () => {
            signOut();
          },
          style: "destructive"
        }
      ]
    );
  };

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
        <StyledText className="text-white text-3xl font-bold">Account</StyledText>
      </StyledView>
      
      <StyledView className="bg-transparent flex-1 px-5 mt-5">
        {/* Account Settings Options */}
        <StyledView className="bg-zinc-900 rounded-2xl overflow-hidden mb-5">
          {/* Change Password */}
          <StyledTouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-zinc-800">
            <StyledView className="bg-transparent flex-row items-center">
              <StyledView className="w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                <FontAwesome name="lock" size={18} color="#7e7e7e" />
              </StyledView>
              <StyledText className="text-white text-lg">Change Password</StyledText>
            </StyledView>
            <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
          </StyledTouchableOpacity>
          
          {/* Account Security */}
          <StyledTouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-zinc-800">
            <StyledView className="bg-transparent flex-row items-center">
              <StyledView className="w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                <FontAwesome name="shield" size={18} color="#7e7e7e" />
              </StyledView>
              <StyledText className="text-white text-lg">Account Security</StyledText>
            </StyledView>
            <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
          </StyledTouchableOpacity>
          
          {/* Privacy Settings */}
          <StyledTouchableOpacity 
            className="flex-row items-center justify-between p-4">
            <StyledView className="bg-transparent flex-row items-center">
              <StyledView className="w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                <FontAwesome name="eye" size={18} color="#7e7e7e" />
              </StyledView>
              <StyledText className="text-white text-lg">Privacy Settings</StyledText>
            </StyledView>
            <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
          </StyledTouchableOpacity>
        </StyledView>
        
        {/* Sign Out Button */}
        <StyledTouchableOpacity
          onPress={handleSignOut}
          className="bg-zinc-800 rounded-xl p-4 flex-row justify-center items-center mt-5">
          <FontAwesome name="sign-out" size={18} color="#FF5A5F" className="mr-2" />
          <StyledText className="text-[#FF5A5F] text-lg font-medium ml-2">Sign Out</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
}
