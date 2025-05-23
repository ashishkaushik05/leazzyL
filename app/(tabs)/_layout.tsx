import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import CustomNavBar from '@/components/CustomTabBar';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Ensure user is authenticated for this route
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);
  
  // Check email verification status and redirect to verification screen if needed
  useEffect(() => {
    // Only check verification if we have a logged-in user with an email
    if (user && user.email) {
      // If email is not verified, redirect to verification page
      if (!user.emailVerified) {
        // Show verification reminder after a delay
        const timer = setTimeout(() => {
          router.push({
            pathname: '/auth/email-verification',
            params: { email: user.email }
          });
        }, 2000); // Show reminder after 2 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [user?.emailVerified, user?.email]);

  return (
    <ProtectedRoute>
      <Tabs 
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }}
        initialRouteName="index"
       tabBar={(props) => <CustomNavBar {...props} />}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />


    </Tabs>
    </ProtectedRoute>
  );
}
