import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropertyType } from '@/components/PropertyCard';

// Key for storing favorites in AsyncStorage
const FAVORITES_STORAGE_KEY = 'leazzy_favorites';

// Get all favorite properties
export const getFavorites = async (): Promise<PropertyType[]> => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storedFavorites) {
      return JSON.parse(storedFavorites);
    }
    return [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Check if a property is in favorites
export const isFavorite = async (propertyId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(property => property.id === propertyId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Add a property to favorites
export const addToFavorites = async (property: PropertyType): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    
    // Check if property already exists in favorites
    if (!favorites.some(fav => fav.id === property.id)) {
      const updatedFavorites = [...favorites, property];
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

// Remove a property from favorites
export const removeFromFavorites = async (propertyId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(property => property.id !== propertyId);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (property: PropertyType): Promise<boolean> => {
  const isCurrentlyFavorite = await isFavorite(property.id);
  
  if (isCurrentlyFavorite) {
    return await removeFromFavorites(property.id);
  } else {
    return await addToFavorites(property);
  }
};
