import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useSecureStorage<T = any>(
  key: string,
  defaultValue: T | null = null
): [T | null, Dispatch<SetStateAction<T | null>>] {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await SecureStore.getItemAsync(key);
        if (stored !== null) {
          try {
            const parsed = JSON.parse(stored);
            setValue(parsed);
          } catch (parseError) {
            console.warn(`Failed to parse stored JSON for key "${key}":`, parseError);
            setValue(defaultValue);
          }
        } else {
          setValue(defaultValue);
        }
      } catch (error) {
        console.error('SecureStore load error:', error);
        setValue(defaultValue);
      }
    };
    loadValue();
  }, [key]);

  useEffect(() => {
    const saveValue = async () => {
      try {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
      } catch (error) {
        console.error('SecureStore save error:', error);
      }
    };
    saveValue();
  }, [key, value]);

  return [value, setValue];
}
