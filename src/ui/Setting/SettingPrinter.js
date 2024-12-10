import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { AuthContext } from '../../context/AuthContext';
import { PrintInfo } from '../../utils/GetDataSession';
import COLORS from '../../const/color';

const SettingPrinter = ({ navigation }) => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const {setPrints} = useContext(AuthContext);
    const {printDevice} = PrintInfo();
    console.log('printDevice: ', printDevice)


  const scanDevices = async () => {
    try {
      const availableDevices = await ThermalPrinterModule.getBluetoothDeviceList();
      setDevices(availableDevices);
      console.log(availableDevices)
     alert('Scan Complete', 'Perangkat berhasil dipindai.');
    } catch (error) {
      alert('Error', `Gagal memindai perangkat: ${error.message}`);
    }
  };
  
  // Pilih perangkat
  const selectDevice = (device) => {
    setSelectedDevice(device);
    setPrints(device)
    alert(`Anda memilih: ${device.deviceName}`);
  };
  const orderData = {
    store: "Kasirify Store",
    address: "Testing Print, Success",
    
    thanksMessage: "Terima Kasih!",
  };
  const printText = async () => {
    if (!selectedDevice) {
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
        device_name: selectedDevice.deviceName,
        address: selectedDevice.macAddress,
      });
      alert('Success', 'Cetak berhasil.');
      navigation.goBack()
    } catch (error) {
      alert('Error', `Gagal mencetak: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Bluetooth Printer</Text>

    <Button title="Scan Perangkat" onPress={scanDevices} />

    {devices.length > 0 && (
      <>
        <Text style={styles.subtitle}>Pilih Perangkat:</Text>
        <FlatList
          data={devices}
          keyExtractor={(item) => item.macAddress}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.deviceItem} onPress={() => selectDevice(item)}>
              <Text  style={styles.title}>{item.deviceName} ({item.macAddress})</Text>
            </TouchableOpacity>
          )}
        />
      </>
    )}
    {selectedDevice  && (
      <View style={styles.printSection}>
        <Text style={styles.selectedDevice}>Perangkat Terpilih: {selectedDevice.deviceName}</Text>
        <Button title="Test Print" onPress={printText} />
      </View>
    )}
   
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:COLORS.dark,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    color:COLORS.dark,
    marginBottom: 10,
  },
  deviceItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    borderRadius: 5,
  },
  printSection: {
    marginTop: 30,
  },
  selectedDevice: {
    fontSize: 16,
    marginBottom: 10,    
    color:COLORS.dark,

  },

});

export default SettingPrinter;
