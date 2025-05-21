// AppProvider.tsx
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { AuthProvider } from '@/contexts/AuthContext';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

// This component provides the necessary context providers for the app
interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}
