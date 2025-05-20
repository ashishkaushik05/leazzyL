import { StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/contexts/FavoritesContext';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Use the PropertyType from the existing PropertyCard component
import { PropertyType } from '@/components/PropertyCard';

// Create styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledFlatList = styled(FlatList<PropertyType>);

// Constants
const FAVORITES_STORAGE_KEY = 'leazzy_favorites';

// Sample properties for demo purposes - used when resetting favorites
const sampleProperties: PropertyType[] = [
  {
    id: '1',
    title: 'Pinewood Heights',
    price: 18500,
    location: 'Aerocity, New Delhi',
    bhk: '2 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1470&auto=format&fit=crop',
    amenities: ['Television', 'Wifi', 'Parking']
  },
  {
    id: '2',
    title: 'Skyview Apartments',
    price: 22000,
    location: 'Gurgaon, Haryana',
    bhk: '3 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1476&auto=format&fit=crop',
    amenities: ['Wifi', 'Gym', 'Security']
  },
  {
    id: '3',
    title: 'Cedar Heights',
    price: 15000,
    location: 'Noida, UP',
    bhk: '1 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1459535653751-d571815e906b?q=80&w=1470&auto=format&fit=crop',
    amenities: ['Wifi', 'AC', 'Swimming Pool']
  }
];

export default function FavoritesScreen() {
  // Get favorites data and methods from context
  const { favorites, isLoading: loading, toggleFavorite, refresh } = useFavorites();
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Handle toggle favorite with notification
  const handleFavoriteToggle = async (property: PropertyType, isLiked: boolean) => {
    await toggleFavorite(property);
    // No need to trigger notification here as it's handled in FavoritesContext
  };
  
  // Refresh favorites list from sample data
  const resetFavorites = async () => {
    // Import AsyncStorage directly for this specific case
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    
    // Store sample properties in AsyncStorage
    await AsyncStorage.setItem('leazzy_favorites', JSON.stringify(sampleProperties));
    
    // Refresh the favorites list from AsyncStorage
    await refresh();
    triggerNotification("Sample favorites loaded!");
  };

  useEffect(() => {
    // Request permission for notifications 
    registerForPushNotificationsAsync();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      console.log('Notification received!');
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      // Clean up listeners when component unmounts
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Function to request permissions and get token
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#9370DB',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Push notifications need permission to appear!');
        return;
      }
    } else {
      Alert.alert('Physical device required', 'Must use physical device for push notifications');
    }
  }

  // Trigger a notification with custom message
  const triggerNotification = async (message: string = "Favorites updated!") => {
    // Increment notification count
    setNotificationCount((prevCount: number) => prevCount + 1);
    
    try {
      // Use scheduleNotificationAsync with immediate trigger
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Leazzy Favorites 🏠",
          body: message,
          data: { screen: 'favorites' },
        },
        trigger: null, // null trigger means show immediately
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      
      // Fallback to alert if notification fails
      Alert.alert("Notification", message);
    }
  };

  // Header component for the favorites list
  const renderHeader = () => (
    <StyledView className="px-4 pb-4">
      {/* Title and Refresh Button */}
      <StyledView className="flex-row justify-between items-center mt-2 mb-2">
        <StyledText className="text-2xl font-bold text-white">My Favorites</StyledText>
        <StyledTouchableOpacity 
          className="bg-primary/20 p-2 rounded-full"
          onPress={resetFavorites}
          activeOpacity={0.7}
        >
          <FontAwesome name="refresh" size={18} color="#9370db" />
        </StyledTouchableOpacity>
      </StyledView>
      
      <StyledView className="mb-4 h-px bg-gray-800" />
      
      {favorites.length === 0 && !loading && (
        <StyledView className="items-center justify-center py-10">
          <FontAwesome name="heart-o" size={50} color="#666" />
          <StyledText className="text-dark-muted text-lg mt-4 text-center">
            No favorite properties yet
          </StyledText>
          <StyledTouchableOpacity 
            className="mt-6 bg-primary py-3 px-6 rounded-full"
            onPress={() => triggerNotification("Try finding properties and tapping the heart icon!")}
          >
            <StyledText className="text-white font-bold">Browse Properties</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      {loading ? (
        <StyledView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#9370db" />
          <StyledText className="text-dark-muted mt-4">Loading favorites...</StyledText>
        </StyledView>
      ) : (
        <StyledFlatList
          data={favorites}
          keyExtractor={(item: PropertyType) => item.id}
          renderItem={({ item }: { item: PropertyType }) => (
            <StyledView className="px-4">
              <PropertyCard 
                property={item} 
                onPress={() => triggerNotification(`Viewing ${item.title}`)}
                isFavorite={true}
                onLike={handleFavoriteToggle}
                classese="w-full"
              />
            </StyledView>
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={null}
        />
      )}
      
      {/* Empty state footer button */}
      {favorites.length === 0 && !loading && (
        <StyledView className="bg-black pb-4 pt-2 px-4 border-t border-gray-800">
          <StyledTouchableOpacity 
            className="bg-primary py-3 rounded-full flex-row items-center justify-center"
            onPress={resetFavorites}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={20} color="white" />
            <StyledText className="text-white font-bold ml-2">Load Sample Properties</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
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
