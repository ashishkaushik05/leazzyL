import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from '@/components/Themed';
import { styled } from 'nativewind';
import React from 'react';

const StyledView = styled(View);

export default function AddPropertyLayout() {
  return (
    <StyledView className="flex-1 bg-black">
      <Stack 
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'black' }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="amenities" options={{ headerShown: false }} />
        <Stack.Screen name="other-amenities" options={{ headerShown: false }} />
        <Stack.Screen name="location" options={{ headerShown: false }} />
        <Stack.Screen name="price" options={{ headerShown: false }} />
        <Stack.Screen name="photos" options={{ headerShown: false }} />
        <Stack.Screen name="rules" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="availability" options={{ headerShown: false }} />
        <Stack.Screen name="summary" options={{ headerShown: false }} />
      </Stack>
    </StyledView>
  );
}