import { usePersistStorage } from '@/hooks/usePersistStorage';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User as FirebaseUser, updateProfile, getAuth, onAuthStateChanged, signInWithCustomToken, sendEmailVerification, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (user: FirebaseUser) => void;
  signOut: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<string>;
  initializeUser: (user: FirebaseUser) => void;
  refreshUser: () => Promise<boolean>;
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
          emailVerified: firebaseUser.emailVerified,
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
        emailVerified: firebaseUser.emailVerified,
      };
      
      // Save/update user data in Firestore
      try {
        const { createUser, getUserByEmail } = await import('@/utils/firestoreDb');
        
        // Check if the user already exists in Firestore
        const existingUser = await getUserByEmail(firebaseUser.email || '');
        
        if (!existingUser && firebaseUser.email) {
          // Create new user in Firestore
          await createUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            phone: firebaseUser.phoneNumber || null,
            profileImage: firebaseUser.photoURL || null,
            role: 'USER',
          });
        }
      } catch (dbError) {
        console.error('Error saving user to Firestore:', dbError);
        // Continue with sign-in even if Firestore update fails
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  const initializeUser = async (firebaseUser: FirebaseUser) => {
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
        emailVerified: firebaseUser.emailVerified,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      // No navigation happens here
    } catch (error) {
      console.error('Error during user initialization:', error);
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

  const sendVerificationEmail = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      await sendEmailVerification(auth.currentUser);
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending verification email:', error);
      return Promise.reject(error);
    }
  };

  const sendPhoneVerification = async (phoneNumber: string) => {
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
      return Promise.resolve(confirmation.verificationId);
    } catch (error) {
      console.error('Error sending phone verification:', error);
      return Promise.reject(error);
    }
  };

  const refreshUser = async () => {
    try {
      if (!auth.currentUser) {
        // User is not signed in, return false without throwing an error
        return false;
      }
      
      // Force reload to get latest user data including emailVerified status
      await auth.currentUser.reload();
      
      // Update the user state with refreshed data
      const userData: User = {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        phoneNumber: auth.currentUser.phoneNumber,
        photoURL: auth.currentUser.photoURL,
        emailVerified: auth.currentUser.emailVerified,
      };
      
      setUser(userData);
      return auth.currentUser.emailVerified;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut, 
      isLoading, 
      isAuthenticated, 
      updateUserProfile,
      sendVerificationEmail,
      sendPhoneVerification,
      initializeUser,
      refreshUser
    }}>
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
