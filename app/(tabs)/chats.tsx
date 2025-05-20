import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import React from 'react';
import { styled } from 'nativewind';

// Create styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function ChatsScreen() {
  return (
    <StyledSafeAreaView className="flex-1">
      <StyledView className="flex-1 items-center justify-center">
        <StyledText className="text-xl font-bold">Chats</StyledText>
        <StyledView className="w-4/5 h-px my-8 bg-gray-200 dark:bg-gray-800" />
        <StyledText>Your messages will appear here</StyledText>
      </StyledView>
    </StyledSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
