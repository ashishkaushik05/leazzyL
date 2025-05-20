import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/BackButton';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

export default function ContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  const [ownerName, setOwnerName] = useState(propertyData.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(propertyData.ownerPhone || '');
  const [ownerEmail, setOwnerEmail] = useState(propertyData.ownerEmail || '');

  // Simple validation for required fields and basic email format
  const isNameValid = ownerName.trim().length > 0;
  const isPhoneValid = ownerPhone.trim().length >= 10;
  const isEmailValid = /^\S+@\S+\.\S+$/.test(ownerEmail);
  const isFormValid = isNameValid && isPhoneValid && isEmailValid;

  const handleNext = () => {
    // Update property data with contact details
    const updatedPropertyData = {
      ...propertyData,
      ownerName,
      ownerPhone,
      ownerEmail
    };

    // Navigate to the next screen with updated property data
    router.push({
      pathname: '/add-property/availability',
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
          Contact information
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-9/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-4">
          Who should tenants contact?
        </StyledText>
        
        <StyledText className="text-gray-400 mb-8">
          Provide contact details for inquiries about this property
        </StyledText>
        
        {/* Contact Form */}
        <StyledView className="space-y-6 bg-transparent">
          {/* Name */}
          <StyledView className="bg-transparent">
            <StyledText className="text-white text-base mb-2">Full Name*</StyledText>
            <StyledTextInput
              className={`bg-[#262626] text-white p-4 rounded-lg ${!isNameValid && ownerName ? 'border-red-500 border-2' : ''}`}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder="Your name"
              placeholderTextColor="#999"
            />
            {!isNameValid && ownerName ? (
              <StyledText className="text-red-500 text-sm mt-1">
                Please enter your name
              </StyledText>
            ) : null}
          </StyledView>
          
          {/* Phone */}
          <StyledView className="bg-transparent">
            <StyledText className="text-white text-base mb-2">Phone Number*</StyledText>
            <StyledTextInput
              className={`bg-[#262626] text-white p-4 rounded-lg ${!isPhoneValid && ownerPhone ? 'border-red-500 border-2' : ''}`}
              value={ownerPhone}
              onChangeText={setOwnerPhone}
              placeholder="Your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {!isPhoneValid && ownerPhone ? (
              <StyledText className="text-red-500 text-sm mt-1">
                Please enter a valid phone number
              </StyledText>
            ) : null}
          </StyledView>
          
          {/* Email */}
          <StyledView className="bg-transparent">
            <StyledText className="text-white text-base mb-2">Email Address*</StyledText>
            <StyledTextInput
              className={`bg-[#262626] text-white p-4 rounded-lg ${!isEmailValid && ownerEmail ? 'border-red-500 border-2' : ''}`}
              value={ownerEmail}
              onChangeText={setOwnerEmail}
              placeholder="Your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!isEmailValid && ownerEmail ? (
              <StyledText className="text-red-500 text-sm mt-1">
                Please enter a valid email address
              </StyledText>
            ) : null}
          </StyledView>
          
          {/* Privacy Note */}
          <StyledView className="bg-[#262626] p-4 rounded-lg">
            <StyledText className="text-white font-semibold mb-2">Privacy Note:</StyledText>
            <StyledText className="text-gray-400">
              Your contact information will only be shared with interested tenants who request to contact you.
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
      
      {/* Navigation buttons */}
      <StyledRNView className="flex-row px-4 pb-8 pt-4 bg-black">
        <StyledTouchableOpacity
          className="flex-1 py-4 rounded-full bg-white mr-2"
          onPress={handleBack}
        >
          <StyledText className="text-black text-center text-lg font-semibold">
            Back
          </StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity
          className={`flex-1 py-4 rounded-full ${
            isFormValid ? 'bg-purple-600' : 'bg-gray-700'
          } ml-2`}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            Next
          </StyledText>
        </StyledTouchableOpacity>
      </StyledRNView>
    </StyledSafeAreaView>
  );
}
