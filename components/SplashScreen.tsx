import { StyleSheet, View, Image, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Text } from '@/components/Themed';
import { styled } from 'nativewind';
import CircularGradient from './CircularGradient';
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animations complete, wait a bit and then notify parent
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 500);
    });
  }, [fadeAnim, scaleAnim, onAnimationComplete]);

  return (
    <StyledView className="flex-1 bg-black justify-center items-center">
    <CircularGradient diameter={1800} />
      
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <StyledImage
          source={require('@/public/images/logo/main.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }}
      >
        <StyledText className="text-3xl font-bold text-white mt-5">Leazzy</StyledText>
        <StyledText className="text-gray-300 text-lg mt-2 text-center">
          Your home, your way.
        </StyledText>
      </Animated.View>
    </StyledView>
  );
}
