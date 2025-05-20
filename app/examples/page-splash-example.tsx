import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import PageLoadingScreen from '@/components/PageLoadingScreen';
import { TouchableOpacity } from 'react-native';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PageSplashExample() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<string[]>([]);

  // Simulating data loading
  useEffect(() => {
    // This simulates an API call or data loading process
    const loadData = async () => {
      try {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set example data
        setData(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // Hide loading screen when done
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to demonstrate manually triggering the loading screen
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate reloading data
    setTimeout(() => {
      setData(prev => [...prev, `New Item ${prev.length + 1}`]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledView className="flex-1 p-4">
      <StyledText className="text-3xl font-bold text-white my-6">
        Page Splash Example
      </StyledText>
      
      <StyledText className="text-white text-lg mb-4">
        This page demonstrates how to use a splash/loading screen on a specific page.
      </StyledText>
      
      {/* The main content */}
      <ScrollView>
        <StyledView className="py-2">
          {data.map((item, index) => (
            <StyledView key={index} className="bg-gray-800 p-4 rounded-lg mb-3">
              <StyledText className="text-white text-lg">{item}</StyledText>
            </StyledView>
          ))}
        </StyledView>
      </ScrollView>
      
      {/* Action buttons */}
      <StyledView className="flex-row my-4">
        <StyledTouchableOpacity 
          className="bg-purple-600 py-3 px-6 rounded-full mr-3 flex-1"
          onPress={handleRefresh}
        >
          <StyledText className="text-white text-center font-semibold">
            Refresh (Show Loader)
          </StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity 
          className="bg-gray-600 py-3 px-6 rounded-full flex-1"
          onPress={() => router.back()}
        >
          <StyledText className="text-white text-center font-semibold">
            Go Back
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      
      {/* The loading screen overlay */}
      {isLoading && (
        <PageLoadingScreen 
          message="Loading data..." 
          icon="list"
        />
      )}
    </StyledView>
    </StyledSafeAreaView>
  );
}
