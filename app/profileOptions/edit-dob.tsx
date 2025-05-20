import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import CircularGradient from '@/components/CircularGradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/contexts/AuthContext';

// Styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function EditDOBScreen() {
  const { user, updateUserProfile, isLoading } = useAuth();
  // Default to a date if not provided in user data
  const [date, setDate] = useState(new Date(2002, 7, 5)); // Aug 5, 2002
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'android') {
        setShowPicker(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleSave = async () => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to update your profile');
        return;
      }
      
      // Note: We would actually want to add a dateOfBirth field to the User type
      // For now, we'll just go back as if it was saved
      // await updateUserProfile({ dateOfBirth: date.toISOString() });
      
      // Mock delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update date of birth');
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
        <StyledText className="text-white text-4xl font-bold mb-8">Date of birth</StyledText>
        
        {/* Date Input */}
        <StyledTouchableOpacity 
          onPress={() => Platform.OS === 'android' && setShowPicker(true)}
          className="bg-zinc-800 rounded-xl p-4 mb-4">
          <StyledView className="flex-row justify-between items-center">
            <StyledText className="text-white text-xl">{formatDate(date)}</StyledText>
            {Platform.OS === 'ios' ? null : (
              <StyledText className="text-white">▼</StyledText>
            )}
          </StyledView>
        </StyledTouchableOpacity>
        
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            minimumDate={new Date(1940, 0, 1)}
            style={{ backgroundColor: 'transparent' }}
          />
        )}
        
        <StyledText className="text-gray-400 text-sm mb-1">
          To sign up, you need to be <StyledText className="text-white font-semibold">at least 18</StyledText>
        </StyledText>
        <StyledText className="text-gray-400 text-sm mb-8">
          Your birthdate won't be shared with anyone who uses our app
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