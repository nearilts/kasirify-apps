import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet,ScrollView } from 'react-native';
import useFetchData from '../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import UseGetData from '../../utils/UseGetData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import { PrintInfo } from '../../utils/GetDataSession';
import ThermalPrinterModule from 'react-native-thermal-printer';
import Carousel from '../../component/Carousel';
import styles from '../../const/styles';
import ButtomIcon from '../../component/ButtomIcon';
import COLORS from '../../const/color';
import ButtonCircle from '../../component/ButtonCircle';
import { formatNumber } from '../../utils/Helper';

const HomeScreen = ({ navigation }) => {
  const { datas: Datas, isLoading } = useFetchData(navigation, 'home');
 
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
      alert(`Gagal mencetak: ${error.message}`);
    }
  };

  return (
    <ScrollView style={{backgroundColor:COLORS.white}}>
      <Carousel />

      <View style={[styles.containers, {top : -50}]}>
      <View style={styles.card90}>
          <View style={styles.flexRowaround}>
              <View style={styles.flexColumnBetween}> 
                <Text style={{color:COLORS.dark}}>
                  Saldo PPOB
                </Text>
                <Text style={styles.text18}>
                  Rp. {formatNumber(Datas?.data.toko.saldo)}
                </Text>
              </View>
              {/* <View style={{width:1, height:45, backgroundColor:COLORS.dark}}>
                
              </View> */}
              <View style={styles.flexColumnBetween}> 
                <Text style={{color:COLORS.dark}}>
                    Saldo Toko
                </Text>
                <Text style={styles.text18}>
                    Rp. {formatNumber(Datas?.data.toko.saldo_toko)}
                </Text>
              </View>
          </View>
        </View>
    </View>
    <View style={[styles.containers, {top : -40}]}>
      <View style={styles.card90}>
          <View style={styles.flexRowaround}>
              <View style={styles.flexColumnBetween}> 
                <Text style={{color:COLORS.dark}}>
                  Omset Hari Ini
                </Text>
                <Text style={styles.text18}>
                  Rp. {formatNumber(Datas?.data.total_amount_today)}
                </Text>
              </View>
              <View style={{width:1, height:45, backgroundColor:COLORS.dark}}>
                
              </View>
              <View style={styles.flexColumnBetween}> 
                <Text style={{color:COLORS.dark}}>
                    Profit Hari Ini
                </Text>
                <Text style={styles.text18}>
                    Rp. {formatNumber(Datas?.data.total_profit_today)}
                </Text>
              </View>
          </View>
        </View>
    </View>

      <View style={{top : -30}}>
        <ButtomIcon />
      </View>
      
      <View style={[styles.containers,{marginBottom:30}]}>
        <View style={styles.card90}>
        <Text style={[styles.text18,{marginLeft:20, fontWeight:'bold'}]}>Setting</Text>
          <View style={styles.flexRowaround}>
          {printDevice?.deviceName ? (
            <>
             <ButtonCircle
                  iconName="print"
                  color={COLORS.primary2} 
                  onPress={() => printText()} 
                  label="Test Print" 
              />
            </>
            )
            : (
              <>
               <ButtonCircle
                  iconName="print"
                  color={COLORS.primary2} 
                  onPress={() => navigation.navigate("SettingPrinter")} 
                  label="Setting" 
              />
              </>
            )}


             
              <ButtonCircle
                  iconName="unarchive"
                  color={COLORS.pink} 
                  onPress={() => logoutTokos()} 
                  label="Ganti Toko" 
              />
              <ButtonCircle
                  iconName="logout"
                  color={COLORS.pink} 
                  onPress={() => logouts()} 
                  label="Logout" 
              />

          {Datas?.data.kasir?.amount_start ? (
            <>
             <ButtonCircle
                  iconName="point-of-sale"
                  color={COLORS.primary2} 
                  onPress={() => navigation.navigate("TutupKasir")} 
                  label="Tutup Kasir" 
              />
            </>
            )
            : (
              <>
               <ButtonCircle
                  iconName="point-of-sale"
                  color={COLORS.primary2} 
                  onPress={() => navigation.navigate("OpenCashier")} 
                  label="Buka Kasir" 
              />
              </>
            )}

          </View>
          
          
        </View>
      </View>

    </ScrollView>
  );
};

const style = StyleSheet.create({
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
