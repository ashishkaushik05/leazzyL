import React, { createContext, useState, useContext, useEffect } from 'react';
import { PropertyType } from '@/components/PropertyCard';
import { getFavorites, toggleFavorite, isFavorite } from '@/utils/favoritesManager';
import * as Notifications from 'expo-notifications';

interface FavoritesContextType {
  favorites: PropertyType[];
  isLoading: boolean;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (property: PropertyType) => Promise<void>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isLoading: true,
  isFavorite: () => false,
  toggleFavorite: async () => {},
  refresh: async () => {},
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Show notification
  const showNotification = async (message: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Leazzy Favorites 🏠",
          body: message,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  // Load favorites
  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const storedFavorites = await getFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if property is in favorites
  const checkIsFavorite = (propertyId: string): boolean => {
    return favorites.some(property => property.id === propertyId);
  };

  // Toggle property favorite status
  const handleToggleFavorite = async (property: PropertyType) => {
    const isPropertyFavorite = checkIsFavorite(property.id);
    try {
      await toggleFavorite(property);
      
      // Update state based on current status
      if (isPropertyFavorite) {
        setFavorites(favorites.filter(fav => fav.id !== property.id));
        showNotification("Property removed from favorites!");
      } else {
        setFavorites([...favorites, property]);
        showNotification("Property added to favorites!");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite: checkIsFavorite,
        toggleFavorite: handleToggleFavorite,
        refresh: loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
