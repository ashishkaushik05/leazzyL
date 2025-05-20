import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

// Create styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function TestTailwindComponent() {
  return (
    <StyledView className="p-4 m-4 bg-primary rounded-lg">
      <StyledText className="text-white text-lg font-bold">
        Tailwind is working!
      </StyledText>
      <StyledTouchableOpacity className="bg-white mt-2 p-2 rounded">
        <StyledText className="text-primary text-center">
          Test Button
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
}
