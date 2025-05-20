import { useColorScheme as useDeviceColorScheme } from 'react-native';

// Custom hook that always returns 'dark' regardless of the device setting
export function useColorScheme(): 'light' | 'dark' {
  const deviceColorScheme = useDeviceColorScheme();
  // Always return 'dark' to ensure app stays in dark mode
  return 'dark';
}
