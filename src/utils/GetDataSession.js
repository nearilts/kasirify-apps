import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const TokoInfo = () => {
  const [toko_id, settokoinfo] = useState(null);

  useEffect(() => {
    const fetchTokoInfo = async () => {
      try {
        const response = await AsyncStorage.getItem('TokoInfo');
        console.log('manggil', response);
        settokoinfo(response ? JSON.parse(response) : null);  // Ensure it's parsed if it's a JSON object
      } catch (error) {
        console.error('Failed to fetch TokoInfo:', error);
      }
    };

    fetchTokoInfo();
  }, []); // Empty dependency array ensures this runs only once when the component mounts.

  return { toko_id };
};


export const PrintInfo = () => {
  const [printDevice, setDeviceInfo] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPrintInfo = async () => {
        try {
          const response = await AsyncStorage.getItem('PrintInfo');
          console.log('manggil PrintInfo:', response);
          if (response) {
            setDeviceInfo(JSON.parse(response)); // Parse JSON string to object
          }
        } catch (error) {
          console.error('Failed to fetch PrintInfo:', error);
        }
      };

      fetchPrintInfo(); // Call when page is focused
    }, []) // Dependencies
  );

  return { printDevice };
};