import { LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

/**
 * Configure deep linking
 * This allows your app to handle specific URL schemes
 */
export const linking: LinkingOptions<any> = {
  prefixes: ['leazzy://', 'https://leazzy.app'],
  
  config: {
    screens: {
      // Map deep link paths to your screens
      '/auth/email-verification': 'auth/email-verification',
      '/auth/phone-verification': 'auth/phone-verification',
      '/auth/reset-password': 'auth/reset-password',
    },
  },
  
  // Handle custom URL schemes not covered by the navigator
  async getInitialURL() {
    // Get the URL that launched the app
    const url = await Linking.getInitialURL();
    
    if (url != null) {
      // Handle Firebase email verification/password reset links
      if (url.includes('mode=verifyEmail') || url.includes('mode=resetPassword')) {
        // Parse the URL to extract action code and mode
        const params = new URLSearchParams(url.split('?')[1]);
        const mode = params.get('mode');
        const actionCode = params.get('oobCode');
        const email = params.get('email') || '';
        
        // Based on the mode, navigate to the appropriate screen
        if (mode === 'verifyEmail') {
          // Navigate to the email verification screen with the action code
          setTimeout(() => {
            router.push({
              pathname: '/auth/email-verification',
              params: { mode, actionCode, email }
            });
          }, 500);
        } else if (mode === 'resetPassword') {
          // Navigate to the password reset screen with the action code
          setTimeout(() => {
            router.push({
              pathname: '/auth/reset-password',
              params: { mode, actionCode, email }
            });
          }, 500);
        }
        
        return null; // Let the app handle the navigation
      }
    }
    
    return url;
  },
  
  subscribe(listener) {
    // Listen for URL events while the app is running
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });
    
    // Listen for notification events
    const notificationSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data?.url;
      if (url) {
        listener(url);
      }
    });
    
    // Return a function to unsubscribe when the component is unmounted
    return () => {
      linkingSubscription.remove();
      notificationSubscription.remove();
    };
  },
};
