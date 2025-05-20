// This file initializes NativeWind for proper functionality
import { useEffect } from 'react';
import { Platform, UIManager } from 'react-native';

export function setupTailwind() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
}
