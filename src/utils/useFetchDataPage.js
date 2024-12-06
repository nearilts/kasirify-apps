import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';

const useFetchDataPage = (navigation, endpoint) => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const fetchDatas = async (url) => {
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

      const response = await axios.get(url || `${BASE_URL}api/${endpoint}${param}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDatas(response.data); // Set data awal
      setNextPageUrl(response.data.data.next_page_url); // Simpan URL halaman berikutnya
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMore = async (url) => {
    if (!url) return;
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];
      let toko_id = await AsyncStorage.getItem('TokoInfo');
      toko_id = JSON.parse(toko_id);
      let param = '';
  
      if (toko_id && toko_id.toko_id) {
        param = `&toko_id=${toko_id.toko_id}`;
      }
      console.log(url + param);
  
      const response = await axios.get(url + param, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Current datas:', response.data);
  
      setDatas((prevDatas) => {
  
        const previousArray = Array.isArray(prevDatas?.data.data) ? prevDatas.data.data : [];
        const newArray = Array.isArray(response.data.data.data) ? response.data.data.data : [];
        
        const newNextPageUrl = response.data.data.next_page_url;
        return {
            ...prevDatas, 
            data: {
              ...prevDatas.data,  
              data: [...previousArray, ...newArray],
              next_page_url: newNextPageUrl, 
            },
          };
      });
      setNextPageUrl(response.data.data.next_page_url);
    } catch (error) {
      console.error('Fetch more error:', error);
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

  return { datas, isLoading, refetch: () => fetchDatas(), fetchMore };
};

export default useFetchDataPage;
