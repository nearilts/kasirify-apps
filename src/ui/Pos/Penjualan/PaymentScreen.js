import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import UseGetData from '../../../utils/UseGetData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/AuthContext';
import { Linking } from 'react-native';
import usePostData from '../../../utils/usePostData';
import { PrintInfo } from '../../../utils/GetDataSession';
import ThermalPrinterModule from 'react-native-thermal-printer';
import PrinterComponent from '../../../component/PrinterComponent';

const PaymentScreen = ({ navigation, route }) => {
    console.log(route.params)
    let userData = route.params;
    
    const {printDevice} = PrintInfo();

    const { datas: Datas, isLoading,refetch } = useFetchData(navigation, `transaksi/${userData.id}/cek_transaction`);

    const handleOpenURL = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };
   
    const { postData, isLoading:postdata } = usePostData();
    const handlePostAddcart = async () => {
      refetch()
      console.log(Datas)
      };
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Transaksi Berhasil</Text>
          <Text style={styles.title}>{userData.invoice}</Text>
          <Text style={styles.title}>{userData.status}</Text>
          <Button 
            title="Transaksi Baru"
            onPress={() => navigation.goBack()}
          />

          <View style={{marginTop:20, marginBottom:20}}>
          {userData?.gateway && (
            <>
            <View style={{margin:10}}>
            <Button 
                  title="Bayar"
                  onPress={() => handleOpenURL(userData?.gateway.paymentUrl)}
              />
              
            </View>
            
              <Button 
                    title="Cek Status"
                    onPress={() => handlePostAddcart()}
                />
            </>
            )}
          </View>
         

          <PrinterComponent printData={Datas} navigation={navigation}/>
         
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

export default PaymentScreen;
