import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, TextInput, ScrollView, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Conditionally import MapView based on platform
let MapView: any, Marker: any, PROVIDER_GOOGLE: any;
if (Platform.OS !== 'web') {
  // Only import the map components on native platforms
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  PROVIDER_GOOGLE = MapComponents.PROVIDER_GOOGLE;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledTextInput = styled(TextInput);

const { width } = Dimensions.get('window');

// Web placeholder component for MapView
const WebMapPlaceholder = ({ location, onPress }: any) => (
  <StyledRNView className="h-64 bg-[#262626] rounded-lg justify-center items-center">
    <FontAwesome name="map-marker" size={32} color="#9370DB" />
    <StyledText className="text-white text-center mt-4">
      Interactive map not available on web.
    </StyledText>
    <StyledText className="text-gray-400 text-center mt-2">
      Current coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
    </StyledText>
    <StyledTouchableOpacity
      className="mt-4 bg-[#9370DB] px-4 py-2 rounded-lg"
      onPress={() => {
        // Simulate a map press with slightly different coordinates
        const randomOffset = () => (Math.random() - 0.5) * 0.002;
        onPress({
          nativeEvent: {
            coordinate: {
              latitude: location.latitude + randomOffset(),
              longitude: location.longitude + randomOffset(),
            }
          }
        });
        Alert.alert("Location Updated", "Map location has been updated with simulated coordinates.");
      }}
    >
      <StyledText className="text-white">Simulate Map Selection</StyledText>
    </StyledTouchableOpacity>
  </StyledRNView>
);

export default function LocationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ propertyData?: string }>();

    // Initialize property data from params or default
    const initialPropertyData: PropertyData = params.propertyData
        ? JSON.parse(params.propertyData as string)
        : defaultPropertyData;

    const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

    // Form fields
    const [address, setAddress] = useState(propertyData.address || '');
    const [city, setCity] = useState(propertyData.city || '');
    const [state, setState] = useState(propertyData.state || '');
    const [zipCode, setZipCode] = useState(propertyData.zipCode || '');
    
    // Location fields
    const [location, setLocation] = useState({
        latitude: propertyData.latitude || 28.6139,  // Default to New Delhi if no location
        longitude: propertyData.longitude || 77.2090,
    });
    const [mapReady, setMapReady] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Check if form is valid - including verifying that a location has been selected
    const isFormValid = address.trim() !== '' && 
                        city.trim() !== '' && 
                        state.trim() !== '' && 
                        zipCode.trim() !== '' &&
                        location.latitude !== 0 &&
                        location.longitude !== 0;

    // Get location permission and current location
    useEffect(() => {
        (async () => {
            setLoadingLocation(true);
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                
                if (status === 'granted') {
                    setLocationPermission(true);
                    
                    // Only get current location if no saved location
                    if (!propertyData.latitude || !propertyData.longitude) {
                        try {
                            const currentLocation = await Location.getCurrentPositionAsync({});
                            setLocation({
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude,
                            });
                        } catch (error) {
                            console.log('Error getting location:', error);
                        }
                    }
                } else {
                    Alert.alert(
                        "Location Permission Required",
                        "This app needs location permission to function properly. Please enable location services in your settings.",
                        [{ text: "OK" }]
                    );
                }
            } catch (error) {
                console.log('Error requesting location permission:', error);
            } finally {
                setLoadingLocation(false);
            }
        })();
    }, []);

    const handleMapReady = () => {
        setMapReady(true);
    };

    const handleMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
    };

    const handleNext = () => {
        // Make sure location has been set
        if (location.latitude === 0 || location.longitude === 0) {
            Alert.alert("Error", "Please select a location on the map.");
            return;
        }

        // Update property data with location details
        const updatedPropertyData = {
            ...propertyData,
            address,
            city,
            state,
            zipCode,
            latitude: location.latitude,
            longitude: location.longitude
        };

        // Navigate to the next screen with updated property data
        router.navigate({
            pathname: '/add-property/photos',
            params: { propertyData: JSON.stringify(updatedPropertyData) }
        });
    };

    const handleBack = () => {
        router.back();
    };

    // Render map container with platform-specific implementation
    const renderMapContainer = () => {
        if (loadingLocation) {
            return (
                <StyledRNView className="h-64 bg-[#262626] rounded-lg justify-center items-center">
                    <ActivityIndicator size="large" color="#9370DB" />
                    <StyledText className="text-gray-400 mt-2">Loading map...</StyledText>
                </StyledRNView>
            );
        }
        
        if (Platform.OS === 'web') {
            // Render placeholder on web
            return <WebMapPlaceholder location={location} onPress={handleMapPress} />;
        }
        
        // Render native map on mobile platforms
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onMapReady={handleMapReady}
                onPress={handleMapPress}
                showsUserLocation={true}
            >
                {mapReady && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Property Location"
                        description={address}
                        pinColor="#9370DB"
                    />
                )}
            </MapView>
        );
    };

    return (
        <StyledSafeAreaView className="flex-1 bg-black">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <StyledView className="flex-1 px-4 mx-2 bg-black">
                    <StyledText className="text-4xl font-bold text-white my-6">
                        Property location
                    </StyledText>

                    {/* Progress indicator */}
                    <LinearGradient
                        colors={['#9370DB', '#4B0082']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-1 mb-6 rounded-full w-4/11"
                    />

                    <StyledText className="text-2xl font-bold text-white mb-8">
                        Where is your property located?
                    </StyledText>

                    {/* Location Form */}
                    <StyledView className="space-y-6 bg-transparent">
                        {/* Address */}
                        <StyledView className="bg-transparent">
                            <StyledText className="text-white text-base mb-2">Address*</StyledText>
                            <StyledTextInput
                                className="bg-[#262626] text-white p-4 rounded-lg"
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Enter street address"
                                placeholderTextColor="#999"
                            />
                        </StyledView>

                        {/* City */}
                        <StyledView className="bg-transparent">
                            <StyledText className="text-white text-base mb-2">City*</StyledText>
                            <StyledTextInput
                                className="bg-[#262626] text-white p-4 rounded-lg"
                                value={city}
                                onChangeText={setCity}
                                placeholder="Enter city"
                                placeholderTextColor="#999"
                            />
                        </StyledView>

                        {/* State and Zip Code in same row */}
                        <StyledRNView className="flex-row space-x-4">
                            <StyledView className="flex-1 bg-transparent">
                                <StyledText className="text-white text-base mb-2">State*</StyledText>
                                <StyledTextInput
                                    className="bg-[#262626] text-white p-4 rounded-lg"
                                    value={state}
                                    onChangeText={setState}
                                    placeholder="State"
                                    placeholderTextColor="#999"
                                />
                            </StyledView>

                            <StyledView className="flex-1 bg-transparent">
                                <StyledText className="text-white text-base mb-2">ZIP Code*</StyledText>
                                <StyledTextInput
                                    className="bg-[#262626] text-white p-4 rounded-lg"
                                    value={zipCode}
                                    onChangeText={setZipCode}
                                    placeholder="ZIP"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                            </StyledView>
                        </StyledRNView>

                        {/* Google Maps */}
                        <StyledView className="bg-transparent">
                            <StyledText className="text-white text-base mb-2">Select Location on Map*</StyledText>
                            <StyledText className="text-gray-400 text-sm mb-2">
                                {Platform.OS === 'web' 
                                    ? "Enter address details and use the simulate button to set coordinates" 
                                    : "Tap on the map to set your property's precise location"
                                }
                            </StyledText>
                            
                            <StyledRNView className="h-64 w-full rounded-lg overflow-hidden">
                                {renderMapContainer()}
                            </StyledRNView>

                            {/* Display coordinates */}
                            {location.latitude !== 0 && location.longitude !== 0 && (
                                <StyledText className="text-gray-400 text-sm mt-2">
                                    Selected location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </StyledText>
                            )}
                        </StyledView>
                        
                        <StyledView className="h-8" />
                    </StyledView>
                </StyledView>
            </ScrollView>
            
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