import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const { width, height } = Dimensions.get('window');

interface PageLoadingScreenProps {
  message?: string;
  icon?: keyof typeof FontAwesome.glyphMap;
}

export default function PageLoadingScreen({ 
  message = "Loading...", 
  icon = "home" 
}: PageLoadingScreenProps) {
  return (
    <StyledView className="absolute top-0 bottom-0 left-0 right-0 bg-black z-50 flex justify-center items-center">
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(75,0,130,0.8)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <StyledView className="bg-transparent items-center justify-center p-6 rounded-xl">
        <FontAwesome name={icon} size={50} color="#9370DB" />
        <ActivityIndicator size="large" color="#9370DB" className="my-4" />
        <StyledText className="text-white text-lg text-center">{message}</StyledText>
      </StyledView>
    </StyledView>
  );
}
