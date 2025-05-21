import { getSecureData, saveSecureData } from "@/utils/localStorage";
import { useState, useEffect, useRef } from "react";

export const usePersistStorage = <T>(
  key: string,
  primaryValue: T,
  compareFn: (a: T, b: T) => boolean = (a, b) => a === b
) => {
  const [value, setValue] = useState<T>(primaryValue);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Fetch stored data when the component mounts
    const fetchData = async () => {
      try {
        const storedValue = await getSecureData<T>(key);
        if (storedValue !== null) {
          setValue(storedValue);
        }
      } catch (e) {
        console.error(`Failed to fetch or initialize data for key "${key}"`, e);
      }
    };

    fetchData();
  }, [key]);

  useEffect(() => {
    // Save the value to secure storage whenever it changes
    const saveData = async () => {
      try {
        const storedValue = await getSecureData<T>(key);
        if (!compareFn(value, storedValue ?? primaryValue)) {
          await saveSecureData<T>(key, value);
        }
      } catch (e) {
        console.error(`Failed to save data for key "${key}"`, e);
      }
    };

    if (!isFirstLoad.current) {
      saveData();
    } else {
      isFirstLoad.current = false;
    }
  }, [key, value, primaryValue, compareFn]);

  return [value, setValue] as const; // Returning as a tuple for usage like useState
};
