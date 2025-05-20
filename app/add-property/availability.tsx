import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '@/components/BackButton';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledScrollView = styled(ScrollView);

export default function AvailabilityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  // Initialize availability settings
  const [isAvailable, setIsAvailable] = useState(propertyData.isAvailable ?? true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableFrom, setAvailableFrom] = useState(
    propertyData.availableFrom 
      ? new Date(propertyData.availableFrom) 
      : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAvailableFrom(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleNext = () => {
    // Update property data with availability details
    const updatedPropertyData = {
      ...propertyData,
      isAvailable,
      availableFrom: availableFrom.toISOString()
    };

    // Navigate to the summary screen with updated property data
    router.push({
      pathname: '/add-property/summary',
      params: { propertyData: JSON.stringify(updatedPropertyData) }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledScrollView className="flex-1 px-4 bg-black">
        <StyledText className="text-4xl font-bold text-white my-6">
          Availability
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-10/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-4">
          When is your property available?
        </StyledText>
        
        <StyledText className="text-gray-400 mb-8">
          Let tenants know when they can move in
        </StyledText>
        
        {/* Availability Options */}
        <StyledView className="space-y-6 bg-transparent mb-8">
          {/* Available Now Option */}
          <StyledTouchableOpacity
            className={`flex-row p-4 rounded-xl ${
              isAvailable ? 'bg-[#4B0082] border-2 border-purple-500' : 'bg-[#262626] border-2 border-transparent'
            }`}
            onPress={() => setIsAvailable(true)}
          >
            <StyledRNView className="w-10 h-10 rounded-full bg-black bg-opacity-20 items-center justify-center mr-4">
              <FontAwesome name="check-circle" size={20} color={isAvailable ? '#FFF' : '#AAA'} />
            </StyledRNView>
            
            <StyledRNView className="flex-1">
              <StyledText className={`font-semibold ${isAvailable ? 'text-white' : 'text-gray-300'}`}>
                Available Now
              </StyledText>
              <StyledText className={isAvailable ? 'text-gray-300' : 'text-gray-500'}>
                Tenants can move in immediately
              </StyledText>
            </StyledRNView>
            
            {isAvailable && (
              <FontAwesome name="check-circle" size={24} color="#9370DB" />
            )}
          </StyledTouchableOpacity>
          
          {/* Available Later Option */}
          <StyledTouchableOpacity
            className={`flex-row p-4 rounded-xl ${
              !isAvailable ? 'bg-[#4B0082] border-2 border-purple-500' : 'bg-[#262626] border-2 border-transparent'
            }`}
            onPress={() => setIsAvailable(false)}
          >
            <StyledRNView className="w-10 h-10 rounded-full bg-black bg-opacity-20 items-center justify-center mr-4">
              <FontAwesome name="calendar" size={20} color={!isAvailable ? '#FFF' : '#AAA'} />
            </StyledRNView>
            
            <StyledRNView className="flex-1">
              <StyledText className={`font-semibold ${!isAvailable ? 'text-white' : 'text-gray-300'}`}>
                Available Later
              </StyledText>
              <StyledText className={!isAvailable ? 'text-gray-300' : 'text-gray-500'}>
                Set a future date for availability
              </StyledText>
            </StyledRNView>
            
            {!isAvailable && (
              <FontAwesome name="check-circle" size={24} color="#9370DB" />
            )}
          </StyledTouchableOpacity>
          
          {/* Date Picker Option (if Available Later) */}
          {!isAvailable && (
            <StyledTouchableOpacity
              className="bg-[#262626] p-4 rounded-xl"
              onPress={() => setShowDatePicker(true)}
            >
              <StyledText className="text-white font-semibold mb-2">Available From</StyledText>
              <StyledRNView className="flex-row items-center">
                <FontAwesome name="calendar" size={20} color="#AAA" className="mr-2" />
                <StyledText className="text-purple-400">
                  {formatDate(availableFrom)}
                </StyledText>
              </StyledRNView>
            </StyledTouchableOpacity>
          )}
          
          {showDatePicker && (
            <DateTimePicker
              value={availableFrom}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </StyledView>
        
        {/* Summary Card */}
        <StyledView className="bg-[#262626] p-4 rounded-xl mb-8">
          <StyledText className="text-white font-semibold mb-4">Property Summary</StyledText>
          
          <StyledRNView className="flex-row justify-between mb-2">
            <StyledText className="text-gray-400">Type:</StyledText>
            <StyledText className="text-white">{propertyData.propertyType || 'Not specified'}</StyledText>
          </StyledRNView>
          
          <StyledRNView className="flex-row justify-between mb-2">
            <StyledText className="text-gray-400">Location:</StyledText>
            <StyledText className="text-white">{propertyData.city || 'Not specified'}</StyledText>
          </StyledRNView>
          
          <StyledRNView className="flex-row justify-between mb-2">
            <StyledText className="text-gray-400">Rent:</StyledText>
            <StyledText className="text-white">₹{propertyData.rent?.toLocaleString() || 'Not specified'}</StyledText>
          </StyledRNView>
          
          <StyledRNView className="flex-row justify-between">
            <StyledText className="text-gray-400">Availability:</StyledText>
            <StyledText className="text-white">{isAvailable ? 'Available Now' : `From ${formatDate(availableFrom)}`}</StyledText>
          </StyledRNView>
        </StyledView>
      </StyledScrollView>
      
      {/* Navigation buttons */}
      <StyledRNView className="flex-row px-4  pt-4 bg-black">
        <StyledTouchableOpacity
          className="flex-1 py-4 rounded-full bg-white mr-2"
          onPress={handleBack}
        >
          <StyledText className="text-black text-center text-lg font-semibold">
            Back
          </StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity
          className="flex-1 py-4 rounded-full bg-purple-600 ml-2"
          onPress={handleNext}
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            Next
          </StyledText>
        </StyledTouchableOpacity>
      </StyledRNView>
    </StyledSafeAreaView>
  );
}
