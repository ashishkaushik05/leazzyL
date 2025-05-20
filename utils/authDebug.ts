import * as SecureStore from 'expo-secure-store';

/**
 * Utility functions for debugging authentication issues
 */

/**
 * Get all stored authentication tokens for debugging
 * @returns Promise<{accessToken: string|null, refreshToken: string|null}>
 */
export const getStoredAuthTokens = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    
    return {
      accessToken: accessToken ? `${accessToken.substring(0, 15)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null,
    };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return {
      accessToken: null,
      refreshToken: null,
      error: error.message,
    };
  }
};

/**
 * Clear all stored authentication tokens
 * @returns Promise<boolean> Success status
 */
export const clearAuthTokens = async () => {
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    console.log('Auth tokens cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
    return false;
  }
};

/**
 * Diagnostic function to test SecureStore functionality
 * @returns Promise<boolean> Success status
 */
export const testSecureStore = async () => {
  try {
    // Try writing and reading a test value
    await SecureStore.setItemAsync('auth_test_key', 'test_value');
    const readValue = await SecureStore.getItemAsync('auth_test_key');
    const success = readValue === 'test_value';
    
    // Clean up
    await SecureStore.deleteItemAsync('auth_test_key');
    
    return {
      success,
      message: success ? 'SecureStore working properly' : 'SecureStore test failed'
    };
  } catch (error) {
    return {
      success: false,
      message: `SecureStore error: ${error.message}`
    };
  }
};
