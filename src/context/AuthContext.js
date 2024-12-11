// AuthContext.js

import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [TokoInfo, setTokoInfo] = useState({});
  const [PrintInfo, setPrintInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false)


  const logins = (email, password) => {
    setIsLoading(true);
    console.log('login', `${BASE_URL}api/login`);

    axios
      .post(`${BASE_URL}api/login`, { email, password})
      .then((res) => {
        let userData = res.data.data;
        console.log('response login', userData);
        if (userData.access_token) {
          setUserInfo(userData);
          AsyncStorage.setItem('userInfo', JSON.stringify(userData))
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              alert('Error saving userInfo to AsyncStorage: '+ err)
              setIsLoading(false);
          });
        }else{
          alert(userData.messages)
          setIsLoading(false);
        }
        
      })
      .catch((err) => {
          alert('error login: '+err)
        console.log('error login', err);
        setIsLoading(false);
      });
  };

  const setTokos = (toko) => {
    console.log(toko)
    setTokoInfo(toko);

    AsyncStorage.setItem('TokoInfo', JSON.stringify(toko))
           

  };
  const registers = (name,email,phone,city, password,address,navigation) => {
    setIsLoading(true);
    console.log('register', `${BASE_URL}api/register`);

    axios
      .post(`${BASE_URL}api/register`, { name,email,phone,city, password,address})
      .then((res) => {
        let userData = res.data.data;
        console.log('response registers', userData);
        if (userData.access_token) {

          setUserInfo(userData);

          AsyncStorage.setItem('userInfo', JSON.stringify(userData))
            .then(() => {
              setIsLoading(false);
              // navigation.navigate('LoginScreen');

            })
            .catch((err) => {
              alert('Error saving userInfo to AsyncStorage: '+ err)
              setIsLoading(false);
          });
        }else{
          alert(userData.messages)
          setIsLoading(false);

        }
        
      })
      .catch((err) => {
          alert('error register: '+err)
        console.log('error register', err);
        setIsLoading(false);
      });
  };


  const profils = async (token) => {
      axios
        .get(`${BASE_URL}api/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          let userData = res.data;
          console.log('PROFILE', userData)
        })
        .catch((err) => {
          console.log('error login', err);
          setUserInfo({})
          AsyncStorage.removeItem('userInfo')
          setIsLoading(false);
        });
    };

    const logouts = async (navigation) => {
      setUserInfo({})
      AsyncStorage.removeItem('userInfo')
  
      setTokoInfo({})
      AsyncStorage.removeItem('TokoInfo')

      navigation.navigate('LoginScreen');
    };

    const logoutTokos = async (navigation) => {
      setTokoInfo({})
      AsyncStorage.removeItem('TokoInfo')
  
      navigation.navigate('LoginScreen');
    };
  const isLoggedIn = async () => {
      try {
        setSplashLoading(true);
    
        let userInfo = await AsyncStorage.getItem('userInfo');
        console.log('isLoggedIn', userInfo);
    
        if (userInfo) {
          userInfo = JSON.parse(userInfo);
          if (userInfo.access_token) {
            let token = userInfo.access_token.split('|')[1];
            // profils(token);
            setUserInfo(userInfo);
          } else {
            console.error('Access token tidak ditemukan di userInfo');
            setUserInfo({});
          }
        } else {
          console.log('userInfo kosong atau tidak ditemukan');
          setUserInfo({});
        }
    
        setSplashLoading(false);
      } catch (error) {
        console.error('Error di isLoggedIn:', error);
        setSplashLoading(false);
      }
    };
    

    const isLoggedInStore = async () => {
      try {
    
        let TokoInfo = await AsyncStorage.getItem('TokoInfo');
    
        if (TokoInfo) {
          TokoInfo = JSON.parse(TokoInfo);
          if (TokoInfo.id) {
            setTokoInfo(TokoInfo);
          } else {
            console.error('TokoInfo tidak ditemukan di TokoInfo');
            setTokoInfo({});
          }
        } 
    
      } catch (error) {
        console.error('Error di isLoggedInStore:', error);
        setSplashLoading(false);
      }
    };

    const setPrints = (device) => {
      console.log("setPrintInfo :", device)
      setPrintInfo(device);
  
      AsyncStorage.setItem('PrintInfo', JSON.stringify(device))
      // AsyncStorage.removeItem('PrintInfo') 
    };

    const isPrintOnStore = async () => {
      try {
    
        let PrintInfo = await AsyncStorage.getItem('PrintInfo');
    
        if (PrintInfo) {
          PrintInfo = JSON.parse(PrintInfo);
          if (PrintInfo.id) {
            setPrintInfo(PrintInfo);
          } else {
            console.error('PrintInfo tidak ditemukan di PrintInfo');
            setPrintInfo({});
          }
        } 
    
      } catch (error) {
        console.error('Error di isLoggedInStore:', error);
        setSplashLoading(false);
      }
    };
    useEffect(() => {
      isLoggedIn();
      isLoggedInStore();
    }, [])

  return (
    <AuthContext.Provider value={{ 
      isLoading,
      userInfo,
      TokoInfo,
      splashLoading,
      logins,
      logouts,
      registers,
      setTokos,
      logoutTokos,
      setPrints,
      isPrintOnStore

     }}>
      {children}
    </AuthContext.Provider>
  );
};
