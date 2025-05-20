import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import React from 'react';
import { styled } from 'nativewind';
import { Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledSafeAreaView = styled(SafeAreaView);

export default function AddScreen() {
  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledView className="flex-1 px-5 pt-12 mb-40">
        {/* Header */}
        <StyledView>
          <StyledText className="text-white text-4xl font-bold">
            Listed Properties
          </StyledText>
          
          <StyledText className="text-gray-400 text-lg mt-2">
            Your listed properties will appear here
          </StyledText>
        </StyledView>
        
        {/* Empty state with house image */}
        <StyledView className="flex-1 items-center justify-center">
          <StyledImage
            source={require('@/public/images/addProperty/house_large.png')}
            className="w-60 h-60"
            resizeMode="contain"
          />
        </StyledView>
        
        {/* Add property button */}
        <StyledView className="items-center pb-8">
          <StyledTouchableOpacity
            className="bg-purple-600 rounded-full py-4 px-8 w-64 items-center"
            onPress={() => router.push('/add-property')}
          >
            <StyledText className="text-white text-lg font-semibold">
              Add a property
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
}

