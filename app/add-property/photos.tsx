import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BackButton from '@/components/BackButton';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledScrollView = styled(ScrollView);

interface PhotoItem {
  id: string;
  uri: string;
  // Would include Cloudinary URL in production
  cloudinaryUrl?: string;
}

export default function PhotosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  
  // Request permissions function
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Pick image from library
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };
        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Take a photo using camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };
        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  // Remove photo
  const removePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const handleNext = () => {
    // In production, we would upload photos to Cloudinary here
    // and then store the URLs in propertyData.photos
    
    // Update property data with photo URIs for now
    const updatedPropertyData = {
      ...propertyData,
      photos: photos.map(photo => photo.uri)
    };

    // Navigate to the next screen with updated property data
    router.navigate({
      pathname: '/add-property/price',
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
          Add property photos
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-6/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-4">
          Upload photos of your property
        </StyledText>
        
        <StyledText className="text-gray-400 mb-8">
          High-quality photos help attract more tenants. Add at least 3 photos.
        </StyledText>
        
        {/* Photo upload options */}
        <StyledRNView className="flex-row justify-between mb-6">
          <StyledTouchableOpacity
            className="w-[48%] py-6 rounded-xl items-center justify-center bg-[#262626] border-2 border-dashed border-gray-600"
            onPress={takePhoto}
          >
            <FontAwesome name="camera" size={32} color="#AAA" className="mb-2"/>
            <StyledText className="text-gray-400">Take Photo</StyledText>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity
            className="w-[48%] py-6 rounded-xl items-center justify-center bg-[#262626] border-2 border-dashed border-gray-600"
            onPress={pickImage}
          >
            <FontAwesome name="image" size={32} color="#AAA" className="mb-2"/>
            <StyledText className="text-gray-400">Upload Photos</StyledText>
          </StyledTouchableOpacity>
        </StyledRNView>
        
        {/* Photos Grid */}
        {photos.length > 0 && (
          <StyledRNView className="flex-row flex-wrap justify-between mb-8">
            {photos.map((photo) => (
              <StyledRNView key={photo.id} className="w-[48%] h-40 mb-4 rounded-xl overflow-hidden relative">
                <Image
                  source={{ uri: photo.uri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <StyledTouchableOpacity 
                  className="absolute top-2 right-2 bg-black bg-opacity-70 w-8 h-8 rounded-full items-center justify-center"
                  onPress={() => removePhoto(photo.id)}
                >
                  <FontAwesome name="trash" size={16} color="#FFF" />
                </StyledTouchableOpacity>
              </StyledRNView>
            ))}
          </StyledRNView>
        )}
        
        {photos.length === 0 && (
          <StyledView className="items-center py-10 mb-8 bg-transparent">
            <StyledText className="text-gray-500">No photos added yet</StyledText>
          </StyledView>
        )}
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
          className={`flex-1 py-4 rounded-full ${
            photos.length >= 1 ? 'bg-purple-600' : 'bg-gray-700'
          } ml-2`}
          onPress={handleNext}
          disabled={photos.length < 1} // Should require at least one photo in production
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            Next
          </StyledText>
        </StyledTouchableOpacity>
      </StyledRNView>
    </StyledSafeAreaView>
  );
}
