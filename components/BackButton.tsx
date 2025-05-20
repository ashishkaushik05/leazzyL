import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <StyledView className="absolute left-4 top-12 z-10">
      <StyledTouchableOpacity 
        onPress={onPress} 
        className="bg-black/20 rounded-full p-2"
        activeOpacity={0.7}
      >
        <FontAwesome name="chevron-left" size={20} color="white" />
      </StyledTouchableOpacity>
    </StyledView>
  );
}