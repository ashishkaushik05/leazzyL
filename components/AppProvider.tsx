// AppProvider.tsx
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { AuthProvider } from '@/contexts/AuthContext';

// This component provides the necessary wrappers for Tailwind/NativeWind to work properly
interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  // You could add additional providers here if needed

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
