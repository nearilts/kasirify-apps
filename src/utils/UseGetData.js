import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';

const UseGetData = (navigation, endpoint) => {
  const [datas, setDatas] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  const fetchDatas = async () => {
    setIsLoading(true); 
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];
      console.log('token', token);
      let toko_id = await AsyncStorage.getItem('TokoInfo');
      toko_id = JSON.parse(toko_id);
      console.log("Parsed toko_id:", toko_id); 
      let param = '';

      if (toko_id && toko_id.toko_id) {
        param = `?toko_id=${toko_id.toko_id}`;
        console.log("param set to:", param); // Log the final param value
      }

      console.log('url', `${BASE_URL}api/${endpoint}${param}`);
      const response = await axios.get(`${BASE_URL}api/${endpoint}${param}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      console.log('response', response.data);
      setDatas(response.data);


    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchDatas();

  }, []);


  return { datas, isLoading, fetchDatas }; 
};

export default UseGetData;
