import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


  