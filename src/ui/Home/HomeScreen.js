import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useFetchData from '../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import UseGetData from '../../utils/UseGetData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { datas: userData, isLoading } = useFetchData(navigation, 'user');
 
  const {logouts,logoutTokos} = useContext(AuthContext);
  

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>Home Screen</Text>
          <Text style={styles.title}>{userData?.email}</Text>
          <Button 
            title="Go to Home Detail"
            onPress={() => navigation.navigate('HomeDetail')}
          />

          <View style={{marginTop:20, marginBottom:20}}>
          <Button 
              
              title="Logout Toko"
              onPress={() => {logoutTokos()}}
            />
          </View>
         

          <Button 
            title="Logout Akun"
            onPress={() => {logouts()}}
          />


        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default HomeScreen;
