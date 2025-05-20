import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledScrollView = styled(ScrollView);

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // In a real app, we would submit to the server here
      setIsSubmitting(false);
      
      Alert.alert(
        "Property Added Successfully!",
        "Your property has been added and will be visible to tenants once approved by our team.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Navigate back to the home screen
              router.push('/');
            } 
          }
        ]
      );
      
      console.log('Final Property Data:', propertyData);
    }, 2000);
  };

  // Calculate price range to show as ₹<min>-₹<max>
  const getPriceRange = () => {
    const baseRent = propertyData.rent || 0;
    const minPrice = Math.round(baseRent * 0.85);
    const maxPrice = propertyData.rent || 0;
    return `₹${minPrice}-₹${maxPrice}`;
  };

  // Get amenities to display as icons
  const getDisplayAmenities = () => {
    const amenitiesList = [];
    
    if (propertyData.amenities?.wifi) amenitiesList.push("Wifi");
    if (propertyData.amenities?.tv) amenitiesList.push("Television");
    if (propertyData.amenities?.washingMachine) amenitiesList.push("Laundary");
    
    return amenitiesList;
  };

  return (
    <StyledSafeAreaView className="flex-1 ">
 
      <StyledView className="flex-1 bg-[#9370db] px-4 justify-center items-center">
        {/* Heading Text */}
        <StyledText className="text-4xl font-bold text-white text-center mb-12">
          All the steps are{'\n'}completed
        </StyledText>
        
        {/* Property Card */}
        <StyledView 
          className="w-full bg-[#1f1f1f] rounded-3xl overflow-hidden mb-8 scale-[0.95]" 
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 10
          }}
        >
          {/* Property Image */}
          <StyledView className="relative">
            <Image
              source={{ uri: propertyData.photos?.[0] || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1470&auto=format&fit=crop' }}
              style={{ width: '100%', height: 280 }}
              resizeMode="cover"
            />
            {/* Image Navigation Indicator */}
            <StyledView className="absolute bottom-2 self-center bg-black/70 px-3 py-1 rounded-full">
              <StyledText className="text-white text-xs">1/4</StyledText>
            </StyledView>
          </StyledView>
          
          {/* Property Details */}
          <StyledView className="p-4">
            {/* Price Range */}
            <StyledView className="flex-row items-baseline mb-3">
              <StyledText className="text-white text-xl font-bold">
                {getPriceRange()} <StyledText className="text-gray-400 text-base font-normal">month</StyledText>
              </StyledText>
            </StyledView>
            
            {/* Amenities Icons */}
            <StyledRNView className="flex-row mb-4">
              {getDisplayAmenities().map((amenity, index) => (
                <StyledRNView key={index} className="flex-row items-center mr-4">
                  {amenity === 'Television' && <FontAwesome name="tv" size={16} color="white" />}
                  {amenity === 'Wifi' && <FontAwesome name="wifi" size={16} color="white" />}
                  {amenity === 'Laundary' && <FontAwesome name="tint" size={16} color="white" />}
                  <StyledText className="text-white ml-2">{amenity}</StyledText>
                </StyledRNView>
              ))}
              {getDisplayAmenities().length > 0 && (
                <StyledText className="text-white">+1 more</StyledText>
              )}
            </StyledRNView>
            
            {/* Property Name and Type */}
            <StyledText className="text-white text-xl font-bold">
              {propertyData.title || 'Pinewood Heights'}
            </StyledText>
            
            <StyledRNView className="flex-row items-center">
              <StyledText className="text-white text-lg mr-2">
                {propertyData.bedCount || 2} BHK
              </StyledText>
            </StyledRNView>
            
            {/* Location */}
            <StyledText className="text-gray-400 mt-1">
              {propertyData.city || 'Aerocity'}
            </StyledText>
          </StyledView>
        </StyledView>
        
        {/* Request Listing Button */}
        <StyledView className="w-full mb-8 px-4 bg-transparent">
          <StyledTouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="bg-white rounded-full py-4 flex-row justify-center items-center"
          >
            <StyledText className="text-black font-bold text-lg">
              {isSubmitting ? "Processing..." : "Request listing"}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
        
        {/* Cancel Button */}
        <StyledTouchableOpacity 
          onPress={() => router.back()}
          className="mt-2"
        >
          <StyledText className="text-white text-lg underline">Cancel</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
}
