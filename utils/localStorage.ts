import * as SecureStore from "expo-secure-store";

// Save data
export const saveSecureData = async <T>(key: string, value: T): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save data for key "${key}"`, e);
  }
};

// Retrieve data
export const getSecureData = async <T>(key: string): Promise<T | null> => {
  try {
    const result = await SecureStore.getItemAsync(key);
    return result ? (JSON.parse(result) as T) : null;
  } catch (e) {
    console.error(`Failed to fetch data for key "${key}"`, e);
    return null;
  }
};

// Delete data
export const deleteSecureData = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.error(`Failed to delete data for key "${key}"`, e);
  }
};

