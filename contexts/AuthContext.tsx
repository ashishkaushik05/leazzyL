import { usePersistStorage } from '@/hooks/usePersistStorage';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User as FirebaseUser, updateProfile, getAuth, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  signIn: (user: FirebaseUser) => void;
  signOut: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = usePersistStorage<User | null>('user', null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signIn = async (firebaseUser: FirebaseUser) => {
    try {
      // Get the user's ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Store the token in SecureStore for later use
      await SecureStore.setItemAsync('authToken', idToken);
      
      // Update the user state
      const userData: User = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        phoneNumber: firebaseUser.phoneNumber,
        photoURL: firebaseUser.photoURL,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      // Clear any auth tokens
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Update Firebase user profile if needed
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: userData.displayName || auth.currentUser.displayName,
          photoURL: userData.photoURL || auth.currentUser.photoURL,
        });
      }
      if (user) {
        setUser({ ...user, ...userData });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading, isAuthenticated, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
