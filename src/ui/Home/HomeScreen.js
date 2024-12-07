import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useFetchData from '../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import UseGetData from '../../utils/UseGetData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import { PrintInfo } from '../../utils/GetDataSession';
import ThermalPrinterModule from 'react-native-thermal-printer';

const HomeScreen = ({ navigation }) => {
  const { datas: userData, isLoading } = useFetchData(navigation, 'user');
 
  const {logouts,logoutTokos} = useContext(AuthContext);
  const {printDevice} = PrintInfo();

  

  const orderData = {
    store: "Kasirify Store",
    address: "Testing Print, Success",
    
    thanksMessage: "Terima Kasih!",
  };
  const printText = async () => {
    if (!printDevice) {
      alert('No Device', 'Silakan pilih perangkat terlebih dahulu.');
      return;
    }
  
    let payload = `\x1B\x33\x01
        ${orderData.store}
        ${orderData.address}
        ${orderData.thanksMessage}`;
  
    try {
      await ThermalPrinterModule.printBluetooth({
        payload: payload,
        device_name: printDevice.deviceName,
        address: printDevice.macAddress,
      });
      alert('Success', 'Cetak berhasil.');
      navigation.goBack()
    } catch (error) {
      alert('Error', `Gagal mencetak: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>Home Screen</Text>
          <Text style={styles.title}>{userData?.email}</Text>
          {printDevice?.deviceName ? (
            <>
            <View style={{margin:10}}>
              <Text>Print : {printDevice?.deviceName}</Text>
                <View style={{margin:10}}>
                  <Button 
                        title="Print"
                        onPress={() => printText()}
                    />
                </View>
            </View>
              
            </>
            )
          
            : (
              <>
              <View style={styles.container}>
                <Button 
                  title="Go to Setting Printeer"
                  onPress={() => navigation.navigate('SettingPrinter')}
                />
              </View>
              
              </>
            )}

         

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
