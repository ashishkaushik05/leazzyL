import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { API_CONSTANTS } from '@/constants/Auth';

/**
 * Check network connectivity and API server availability
 * @returns {Promise<{isConnected: boolean, serverReachable: boolean, message: string}>}
 */
export const checkNetworkAndServer = async () => {
  try {
    // Check basic network connectivity first
    const networkState = await NetInfo.fetch();
    
    if (!networkState.isConnected) {
      return {
        isConnected: false,
        serverReachable: false,
        message: 'No internet connection. Please check your network settings.'
      };
    }
    
    // Try to reach the backend server
    try {
      const timeout = 5000; // 5 second timeout
      const serverUrl = `${API_CONSTANTS.CURRENT_BASE_URL}/health`; // Add a health endpoint to your backend
      
      console.log(`[Network] Checking server at ${serverUrl}`);
      
      await axios.get(serverUrl, { timeout });
      
      return {
        isConnected: true,
        serverReachable: true,
        message: 'Connected to server'
      };
    } catch (serverError) {
      console.error('[Network] Server check failed:', serverError.message);
      
      return {
        isConnected: true,
        serverReachable: false,
        message: `Server unreachable: ${serverError.message}`
      };
    }
  } catch (error) {
    console.error('[Network] Network check error:', error);
    
    return {
      isConnected: false,
      serverReachable: false,
      message: `Network check failed: ${error.message}`
    };
  }
};

/**
 * Update API base URL with the device's local IP for development
 * This helps connect to a local development server
 */
export const updateApiUrlWithDeviceIp = async () => {
  if (!__DEV__) return; // Only run in development
  
  try {
    const networkInfo = await NetInfo.fetch();
    
    // NetInfo types are different across platforms, so we need to handle this more carefully
    let deviceIp = null;
    
    // Try to access IP in different ways based on the platform and NetInfo structure
    if (networkInfo.details && 'ipAddress' in networkInfo.details) {
      deviceIp = networkInfo.details.ipAddress;
    } else if (networkInfo.details && networkInfo.details.hasOwnProperty('ipv4Address')) {
      // @ts-ignore - Some platforms return ipv4Address
      deviceIp = networkInfo.details.ipv4Address;
    } else {
      console.warn('[Network] Could not determine device IP address');
      return null;
    }
    
    if (!deviceIp) {
      console.warn('[Network] No IP address found');
      return null;
    }
    
    // Extract the subnet from the device IP (e.g., "192.168.1" from "192.168.1.5")
    const subnet = deviceIp.split('.').slice(0, 3).join('.');
    
    // Update the DEV_URL with the likely server address
    // This assumes the server is on the same subnet as the device
    const serverIp = `${subnet}.100`; // Typical development machine IP
    const apiUrl = `http://${serverIp}:5001/api`;
    
    console.log(`[Network] Updated development API URL to: ${apiUrl}`);
    
    // Note: We can't directly modify API_CONSTANTS here due to JS immutability
    // Instead, return the updated URL for use in the app
    return apiUrl;
  } catch (error) {
    console.error('[Network] Error updating API URL:', error);
    return null;
  }
};
