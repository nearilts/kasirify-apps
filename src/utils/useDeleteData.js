import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';

const useDeleteData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteData = async (endpoint) => {
    try {
      setIsLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];


      let toko_id = await AsyncStorage.getItem('TokoInfo');
      toko_id = JSON.parse(toko_id);
      console.log("Parsed delete toko_id:", toko_id); 

      let param = '';
      if (toko_id && toko_id.toko_id) {
        param = '?toko_id='+toko_id.toko_id;
      }


      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      console.log('url delete', `${BASE_URL}api/${endpoint}${param}`);

      const response = await axios.delete(`${BASE_URL}api/${endpoint}${param}`,  { headers });
      console.log('response', response.data);

      setIsLoading(false);
      return response.data; 
    } catch (error) {
      setIsLoading(false);
      console.error('Error posting data:', error);
      throw error; 
    }
  };

  return { deleteData, isLoading };
};

export default useDeleteData;
