import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';
import { TokoInfo } from './GetDataSession';

const useFetchData = (navigation, endpoint) => {
  const [datas, setDatas] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  const fetchDatas = async () => {
    setIsLoading(true); 
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];
      let toko_id = await AsyncStorage.getItem('TokoInfo');
      toko_id = JSON.parse(toko_id);
      let param = '';

      if (toko_id && toko_id.toko_id) {
        param = `?toko_id=${toko_id.toko_id}`;
      }
     
      console.log('url', `${BASE_URL}api/${endpoint}${param}`);
      const response = await axios.get(`${BASE_URL}api/${endpoint}${param}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setDatas(response.data);
      console.log('response.data:', response.data);


    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDatas();
    });
    fetchDatas();

    return () => {
      unsubscribe();
    };
  }, [navigation, endpoint]);

  return { datas, isLoading, refetch: fetchDatas }; 
};

export default useFetchData;
