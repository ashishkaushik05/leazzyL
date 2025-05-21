import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { use, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';
import CustomSplashScreen from '@/components/SplashScreen';
import { StatusBar } from 'expo-status-bar';
import { setupTailwind } from '@/utils/setupTailwind';
import AppProvider from '@/components/AppProvider';
import { useAuth } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/', // Changed to root path
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize Tailwind
    setupTailwind();
    
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        // This is where you'd fetch initial data or setup other things
        
        // Wait for fonts to load
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Log app readiness state
  console.log('App is ready:', appIsReady);

  useEffect(() => {
    if (appIsReady && splashAnimationComplete) {
      // Hide the native splash screen once our custom splash is done
      SplashScreen.hideAsync();
    }
  }, [appIsReady, splashAnimationComplete]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const onSplashAnimationComplete = () => {
    setSplashAnimationComplete(true);
  };

  if (!appIsReady || !loaded || !splashAnimationComplete) {
    return <CustomSplashScreen onAnimationComplete={onSplashAnimationComplete} />;
  }

  return (
    <AppProvider>
      <FavoritesProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="auth/login" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="auth/complete-profile" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="auth/email-signin" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="auth/set-password" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </FavoritesProvider>
    </AppProvider>
  );
}
