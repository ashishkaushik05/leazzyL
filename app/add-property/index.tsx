import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View as RNView, SafeAreaView } from 'react-native';
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

interface BedTypeOption {
  id: string;
  type: string;
  image: any; // Update with proper image type
  bedCount: number;
}
const bhk_image  = require('@/public/images/addProperty/room_bhk.png');
// These will come from @/assets/images/addProperty once you add them
const bedTypeOptions: BedTypeOption[] = [
  { id: '1', type: '1 bhk', image: bhk_image, bedCount: 1 },
  { id: '2', type: '2 bhk', image: bhk_image, bedCount: 2 },
  { id: '3', type: '3 bhk', image: bhk_image, bedCount: 3 },
  { id: '4', type: '1RK or Pg', image: bhk_image, bedCount: 1 },
];

export default function BedroomsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  const handleOptionSelect = (option: BedTypeOption) => {
    setSelectedOption(option.id);
    setPropertyData({
      ...propertyData,
      propertyType: option.type,
      bedCount: option.bedCount
    });
  };

  const handleBack = () => {
    // Navigate back to previous screen
    router.back();
  };

  const handleNext = () => {
    // Navigate to the next screen with updated property data
    router.navigate({
      pathname: '/add-property/amenities',
      params: { propertyData: JSON.stringify(propertyData) },
    });
  };
  
  // Validate form - at least one option must be selected
  const isFormValid = selectedOption !== null;

  return (
    <StyledSafeAreaView className="flex-1 bg-black mx-2 mt-6">
      {/* Back button - first screen references (tabs) */}
      
      <StyledView className="flex-1 px-4 bg-black">
        <StyledText className="text-4xl font-bold text-white my-6">
          Tell us about your place
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-1/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-8">
          How many beds are there
        </StyledText>
        
        <StyledRNView className="flex-row flex-wrap justify-between">
          {bedTypeOptions.map((option) => (
            <StyledTouchableOpacity
              key={option.id}
              className={`w-[48%] h-44 mb-4 rounded-xl overflow-hidden border-2 ${
              selectedOption === option.id ? 'border-purple-500' : 'border-gray-800'
              }`}
              onPress={() => handleOptionSelect(option)}
            >
              <StyledRNView className="flex-1 justify-center items-center pb-4">
              <Image
                source={option.image}
                style={{ 
                width: '65%', 
                height: '65%',
                opacity: 0.7
                }}
                resizeMode="contain"
              />
              </StyledRNView>
              <StyledRNView className="absolute bottom-0 w-full bg-[#01020346] bg-opacity-50 py-2 items-center">
                <StyledText className="text-white text-lg font-semibold">
                  {option.type}
                </StyledText>
              </StyledRNView>
            </StyledTouchableOpacity>
          ))}
        </StyledRNView>
      </StyledView>
      
      {/* Next button */}
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
                    className={`flex-1 py-4 rounded-full ${isFormValid ? 'bg-purple-600' : 'bg-gray-700'
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