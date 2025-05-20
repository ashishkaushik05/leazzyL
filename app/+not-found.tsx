import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { Text, View } from '@/components/Themed';

// Create styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <StyledSafeAreaView className="flex-1">
        <StyledView className="flex-1 items-center justify-center p-5">
          <StyledText className="text-xl font-bold mb-4">This screen doesn't exist.</StyledText>

          <Link href="/" className="mt-4">
            <StyledText className="text-blue-500 font-semibold">Go to home screen!</StyledText>
          </Link>
        </StyledView>
      </StyledSafeAreaView>
    </>
  );
}

// StyleSheet no longer needed as we're using nativewind
