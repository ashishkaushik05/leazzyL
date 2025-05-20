import React, { useState } from 'react';
import { Image, TouchableOpacity, View as RNView, SafeAreaView } from 'react-native';
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

interface AmenityOption {
  id: string;
  name: string;
  icon: any; // This will be replaced with actual images
}

export default function AmenitiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  // Set default values if they don't exist
  const [kitchens, setKitchens] = useState(propertyData.kitchens || 0);
  const [bathrooms, setBathrooms] = useState(propertyData.bathrooms || 0);
  const [balconies, setBalconies] = useState(propertyData.balconies || 0);

  const handleIncrement = (type: 'kitchens' | 'bathrooms' | 'balconies') => {
    switch (type) {
      case 'kitchens':
        setKitchens(prev => prev + 1);
        break;
      case 'bathrooms':
        setBathrooms(prev => prev + 1);
        break;
      case 'balconies':
        setBalconies(prev => prev + 1);
        break;
    }
  };

  const handleDecrement = (type: 'kitchens' | 'bathrooms' | 'balconies') => {
    switch (type) {
      case 'kitchens':
        setKitchens(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'bathrooms':
        setBathrooms(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'balconies':
        setBalconies(prev => prev > 0 ? prev - 1 : 0);
        break;
    }
  };

  const handleNext = () => {
    // Update property data with amenity counts
    const updatedPropertyData = {
      ...propertyData,
      kitchens,
      bathrooms,
      balconies
    };

    // Navigate to the next screen with updated property data
    router.navigate({
      pathname: '/add-property/other-amenities',
      params: { propertyData: JSON.stringify(updatedPropertyData) }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StyledSafeAreaView className="flex-1 mx-2 bg-black mt-5">
      <StyledView className="flex-1 px-4 bg-black">
        <StyledText className="text-4xl font-bold text-white my-6">
          Tell us about your place
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-2/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-8">
          What does this offer
        </StyledText>
        
        {/* Amenities Selection with counters */}
        <StyledView className="space-y-8 bg-transparent">
          {/* Kitchen */}
          <StyledRNView className="flex-row items-center justify-between">
            <StyledRNView className="flex-row items-center">
              <Image 
                source={require( '@/public/images/addProperty/room_bhk.png')} 
                className="w-12 h-12 rounded mr-4"
              />
              <StyledText className="text-white text-xl">Kitchen</StyledText>
            </StyledRNView>
            
            <StyledRNView className="flex-row items-center">
              <StyledTouchableOpacity
                className="w-7 h-7 bg-[#333] rounded-full items-center justify-center"
                onPress={() => handleDecrement('kitchens')}
              >
                <FontAwesome name="minus" size={18} color="#fff" />
              </StyledTouchableOpacity>
              
              <StyledText className="text-white text-xl mx-4 w-6 text-center">
                {kitchens}
              </StyledText>
              
              <StyledTouchableOpacity
                className="w-7 h-7 bg-[#333] rounded-full items-center justify-center"
                onPress={() => handleIncrement('kitchens')}
              >
                <FontAwesome name="plus" size={18} color="#fff" />
              </StyledTouchableOpacity>
            </StyledRNView>
          </StyledRNView>

          {/* Divider */}
          <StyledView className="h-[1px] bg-gray-800" />

          {/* Bathroom */}
          <StyledRNView className="flex-row items-center justify-between">
            <StyledRNView className="flex-row items-center">
              <Image 
                source={require('@/public/images/addProperty/room_bhk.png')} 
                className="w-12 h-12 rounded mr-4"
              />
              <StyledText className="text-white text-xl">Bathroom</StyledText>
            </StyledRNView>
            
            <StyledRNView className="flex-row items-center">
              <StyledTouchableOpacity
                className="w-7 h-7 bg-[#333] rounded-full items-center justify-center"
                onPress={() => handleDecrement('bathrooms')}
              >
                <FontAwesome name="minus" size={18} color="#fff" />
              </StyledTouchableOpacity>
              
              <StyledText className="text-white text-xl mx-4 w-6 text-center">
                {bathrooms}
              </StyledText>
              
              <StyledTouchableOpacity
                className="w-7 h-7 bg-[#333] rounded-full items-center justify-center"
                onPress={() => handleIncrement('bathrooms')}
              >
                <FontAwesome name="plus" size={18} color="#fff" />
              </StyledTouchableOpacity>
            </StyledRNView>
          </StyledRNView>

          {/* Divider */}
          <StyledView className="h-[1px] bg-gray-800" />

          {/* Balcony */}
          <StyledRNView className="flex-row items-center justify-between">
            <StyledRNView className="flex-row items-center">
              <Image 
                source={require('@/public/images/addProperty/room_bhk.png')} 
                className="w-12 h-12 rounded mr-4"
              />
              <StyledText className="text-white text-xl">Balcony</StyledText>
            </StyledRNView>
            
            <StyledRNView className="flex-row items-center">
              <StyledTouchableOpacity
                className="w-7 h-7 bg-[#333] rounded-full items-center justify-center"
                onPress={() => handleDecrement('balconies')}
              >
                <FontAwesome name="minus" size={18} color="#fff" />
              </StyledTouchableOpacity>
              
              <StyledText className="text-white text-xl mx-4 w-6 text-center">
                {balconies}
              </StyledText>
              
              <StyledTouchableOpacity
                className="w-7 h-7 bg-[#333] rounded-full items-center justify-center"
                onPress={() => handleIncrement('balconies')}
              >
                <FontAwesome name="plus" size={18} color="#fff" />
              </StyledTouchableOpacity>
            </StyledRNView>
          </StyledRNView>
        </StyledView>
      </StyledView>
      
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