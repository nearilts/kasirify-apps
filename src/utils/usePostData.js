import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';

const usePostData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const postData = async (endpoint, body, options = {}) => {
    try {
      setIsLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];


      let toko_id = await AsyncStorage.getItem('TokoInfo');
      toko_id = JSON.parse(toko_id);
      console.log("Parsed toko_id:", toko_id); 

      if (toko_id && toko_id.toko_id) {
        body['toko_id'] = toko_id.toko_id;
      }


      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      console.log('url', `${BASE_URL}api/${endpoint}`);
      console.log('body', body);

      const response = await axios.post(`${BASE_URL}api/${endpoint}`, body, { headers });
      console.log('response', response.data);

      setIsLoading(false);
      return response.data; 
    } catch (error) {
      setIsLoading(false);
      console.error('Error posting data:', error);
      throw error; 
    }
  };

  return { postData, isLoading };
};

export default usePostData;
