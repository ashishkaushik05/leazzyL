// filepath: /Users/ashishkaushik/Documents/code/leazzy/contexts/DatabaseContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserById, getUserByEmail } from '@/utils/firestoreDb';
import { useAuth } from './AuthContext';
import { Alert, Platform } from 'react-native';
import { seedDatabase } from '@/utils/databaseSeeder';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DatabaseContextType {
  currentUserData: any | null;
  refreshUserData: () => Promise<void>;
  seedDatabaseIfNeeded: (coordinates?: Coordinates) => Promise<void>;
  isLoadingUserData: boolean;
  userLocation: Coordinates | null;
  setUserLocation: (location: Coordinates) => void;
  requestLocationPermission: () => Promise<boolean>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<any | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(false);
  const [databaseSeeded, setDatabaseSeeded] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const refreshUserData = async () => {
    if (!user || !user.email) return;
    
    setIsLoadingUserData(true);
    try {
      // Get user data from Firestore
      let userData = null;
      
      if (user.uid) {
        userData = await getUserById(user.uid);
      }
      
      // If not found by ID, try looking up by email
      if (!userData && user.email) {
        userData = await getUserByEmail(user.email);
      }
      
      setCurrentUserData(userData);
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Request location permissions and get user's current location
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is needed to show nearby properties.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);
      return true;
    } catch (error) {
      console.error('Error requesting location:', error);
      return false;
    }
  };

  // Fetch user data when auth user changes
  useEffect(() => {
    if (user) {
      refreshUserData();
      // Request location when user logs in
      requestLocationPermission();
    } else {
      setCurrentUserData(null);
    }
  }, [user?.uid, user?.email]);

  // Function to seed the database (for testing/development)
  const seedDatabaseIfNeeded = async (coordinates?: Coordinates) => {
    if (databaseSeeded) {
      Alert.alert('Info', 'Database is already seeded');
      return;
    }
    
    try {
      console.log('Starting database seeding process...');
      // Use provided coordinates or user's location if available
      const locationToUse = coordinates || userLocation;
      
      if (!locationToUse) {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          Alert.alert(
            'Location Required',
            'We need your location to seed properties in your area.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      const result = await seedDatabase(userLocation || undefined);
      
      if (result) {
        console.log('Database seeding completed successfully');
        setDatabaseSeeded(true);
        Alert.alert('Success', 'Database has been seeded successfully with properties near your location!');
      } else {
        throw new Error('Seeding returned false');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      Alert.alert(
        'Error', 
        'Failed to seed database: ' + (error?.message || 'Unknown error'),
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        currentUserData,
        refreshUserData,
        seedDatabaseIfNeeded,
        isLoadingUserData,
        userLocation,
        setUserLocation,
        requestLocationPermission,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
