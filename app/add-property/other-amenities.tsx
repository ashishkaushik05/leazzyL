import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View as RNView, SafeAreaView, ScrollView } from 'react-native';
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

interface OtherAmenityOption {
  id: string;
  name: string;
  icon: string; // FontAwesome icon name
}

// List of other amenities
const otherAmenities: OtherAmenityOption[] = [
  { id: 'wifi', name: 'WiFi', icon: 'wifi' },
  { id: 'ac', name: 'Air Conditioning', icon: 'snowflake-o' },
  { id: 'fridge', name: 'Refrigerator', icon: 'cube' },
  { id: 'tv', name: 'TV', icon: 'television' },
  { id: 'washingMachine', name: 'Washing Machine', icon: 'refresh' },
  { id: 'parking', name: 'Parking', icon: 'car' },
  { id: 'elevator', name: 'Elevator', icon: 'arrow-up' },
  { id: 'security', name: '24/7 Security', icon: 'shield' },
  { id: 'waterpurifyer', name: 'Water Purifier', icon: 'glass-water-roplet' },
  { id: 'guiser', name: 'Guiser', icon: 'tint' },
];

export default function OtherAmenitiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  // Initialize selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState<Record<string, boolean>>(
    propertyData.amenities || {}
  );

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNext = () => {
    // Update property data with selected amenities
    const updatedPropertyData = {
      ...propertyData,
      amenities: selectedAmenities
    };

    // Navigate to the next screen with updated property data
    router.navigate({
      pathname: '/add-property/location',
      params: { propertyData: JSON.stringify(updatedPropertyData) }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StyledSafeAreaView className="flex-1 mx-2 bg-black">
      <StyledScrollView className="flex-1 px-4 bg-black">
        <StyledText className="text-4xl font-bold text-white my-6">
          Tell us about your place
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-3/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-8">
          Other amenities
        </StyledText>
        
        {/* Other Amenities Grid */}
        <StyledRNView className="flex-row flex-wrap justify-between mb-6">
          {otherAmenities.map((amenity) => (
            <StyledTouchableOpacity
              key={amenity.id}
              className={`w-[48%] py-6 mb-4 rounded-xl items-center justify-center ${
                selectedAmenities[amenity.id] 
                  ? 'bg-purple-800 border-2 border-purple-500' 
                  : 'bg-[#262626] border-2 border-transparent'
              }`}
              onPress={() => toggleAmenity(amenity.id)}
            >
              <FontAwesome 
                name={amenity.icon as any} 
                size={32} 
                color={selectedAmenities[amenity.id] ? '#FFF' : '#AAA'} 
                className="mb-2"
              />
              <StyledText 
                className={`text-lg ${
                  selectedAmenities[amenity.id] ? 'text-white font-semibold' : 'text-gray-400'
                }`}
              >
                {amenity.name}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledRNView>
      </StyledScrollView>
      
      {/* Navigation buttons */}
      <StyledRNView className="flex-row px-4 pt-4 bg-black">
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
