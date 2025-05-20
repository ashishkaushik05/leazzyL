import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, TextInput, Dimensions, Image, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { FontAwesome } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);

const screenWidth = Dimensions.get('window').width;

// Custom marker component for the slider
const CustomMarker = () => {
  return (
    <StyledRNView className="w-6 h-6 bg-white rounded-full border-2 border-purple-500 shadow-md" />
  );
};

export default function PriceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();

  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData
    ? JSON.parse(params.propertyData as string)
    : defaultPropertyData;

  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  // Price range states
  const MIN_PRICE = 4000;
  const MAX_PRICE = 25000;
  const [priceRange, setPriceRange] = useState([
    propertyData.rent || 6145,
    propertyData.securityDeposit || 12500
  ]);

  // For display purposes
  const [propertyName, setPropertyName] = useState('Pinewood Heights');
  const [propertyType, setPropertyType] = useState('2 BHK');
  const [propertyLocation, setPropertyLocation] = useState('Aerocity');

  // Effect to update property data when prices change
  useEffect(() => {
    // Get user name from propertyData or use default
    if (propertyData.ownerName) {
      setPropertyName(propertyData.ownerName);
    }

    // Get property type 
    if (propertyData.propertyType) {
      setPropertyType(propertyData.propertyType);
    }

    // Get location
    if (propertyData.city) {
      setPropertyLocation(propertyData.city);
    }
  }, [propertyData]);

  const handleValuesChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleNext = () => {
    // Update property data with pricing details
    const updatedPropertyData = {
      ...propertyData,
      rent: priceRange[0],
      securityDeposit: priceRange[1]
    };

    // Navigate to the next screen with updated property data
    router.navigate({
      pathname: '/add-property/rules',
      params: { propertyData: JSON.stringify(updatedPropertyData) }
    });
  };

  const handleBack = () => {
    router.back();
  };

  // Format number to currency string
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <StyledView className="flex-1 px-4 bg-black mt-6">
          <StyledText className="text-3xl font-bold text-white text-center">
            Set a price
          </StyledText>

          {/* User and Property Details */}
          <StyledView className="mt-8 items-center">
            <StyledText className="text-purple-400 text-2xl font-semibold">
              {propertyName}
            </StyledText>
            <StyledText className="text-white text-lg mt-1">
              price your property...
            </StyledText>
          </StyledView>

          {/* Property Card */}
          <StyledView className="mt-12 mb-8 bg-[#262626] rounded-2xl overflow-hidden">
            {/* Property Image */}
            {propertyData.photos && propertyData.photos.length > 0 ? (
              <StyledRNView className="h-60">
                <StyledImage
                  source={{ uri: propertyData.photos[0] }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <StyledView className="absolute bottom-2 bg-black/50 px-4 rounded-full right-2">
                  <StyledText className="text-white">1/4</StyledText>
                </StyledView>
              </StyledRNView>
            ) : (
              <StyledRNView className="h-60 bg-gray-800 justify-center items-center">
                <FontAwesome name="image" size={60} color="#666" />
              </StyledRNView>
            )}

            {/* Property Price */}
            <StyledView className="p-4">
              <StyledText className="text-gray-400">
                <FontAwesome name="rupee" size={16} color="#999" /> {formatCurrency(priceRange[0]).replace('₹', '')} <StyledText className="text-gray-500">/ month</StyledText>
              </StyledText>

              {/* Amenities Icons */}
              <StyledRNView className="flex-row mt-3">
                <StyledRNView className="flex-row items-center mr-4">
                  <FontAwesome name="tv" size={16} color="#999" />
                  <StyledText className="text-gray-500 ml-2">Television</StyledText>
                </StyledRNView>

                <StyledRNView className="flex-row items-center mr-4">
                  <FontAwesome name="wifi" size={16} color="#999" />
                  <StyledText className="text-gray-500 ml-2">Wifi</StyledText>
                </StyledRNView>

                <StyledText className="text-purple-500">+1 more</StyledText>
              </StyledRNView>

              {/* Property Name */}
              <StyledText className="text-white text-xl font-bold mt-3">
                {propertyType === '2 BHK' ? 'Pinewood Heights' : propertyName} <StyledText className="text-gray-400 font-normal">{propertyType}</StyledText>
              </StyledText>

              <StyledText className="text-gray-500 mt-1">
                {propertyLocation}
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Price Slider Section */}
          <StyledRNView className="mt-6">
            {/* Price Display */}
            <StyledRNView className="flex-row justify-between">
              <StyledText className="text-2xl font-bold text-white">
                {formatCurrency(priceRange[0])}
              </StyledText>
              <StyledText className="text-2xl font-bold text-white">
                {formatCurrency(priceRange[1])}
              </StyledText>
            </StyledRNView>

            {/* Two-way Slider */}
            <StyledRNView className="items-center justify-center mt-4">
              <MultiSlider
                values={priceRange}
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={100}
                sliderLength={screenWidth - 60}
                onValuesChange={handleValuesChange}
                allowOverlap={false}
                minMarkerOverlapDistance={50}
                selectedStyle={{ backgroundColor: '#9370DB' }}
                unselectedStyle={{ backgroundColor: '#333' }}
                containerStyle={{ height: 40 }}
                trackStyle={{ height: 6, borderRadius: 3 }}
                markerStyle={{
                  height: 26,
                  width: 26,
                  borderRadius: 13,
                  backgroundColor: 'white',
                  borderColor: '#9370DB',
                  borderWidth: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                customMarker={CustomMarker}
              />
            </StyledRNView>

            {/* Min and Max labels */}
            <StyledRNView className="flex-row justify-between mt-1">
              <StyledText className="text-gray-500">
                min {formatCurrency(MIN_PRICE)}
              </StyledText>
              <StyledText className="text-gray-500">
                max {formatCurrency(MAX_PRICE)}
              </StyledText>
            </StyledRNView>
          </StyledRNView>
        </StyledView>

        {/* Next Button */}
        <StyledRNView className="px-4 py-8 bg-black">
          <StyledTouchableOpacity
            onPress={handleNext}
            className="bg-purple-600 rounded-full py-4 px-8 items-center"
          >
            <StyledText className="text-white text-xl font-semibold">
              Next
            </StyledText>
          </StyledTouchableOpacity>
        </StyledRNView>
      </ScrollView>
    </StyledSafeAreaView>
  );
}