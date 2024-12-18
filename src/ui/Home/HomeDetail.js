import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ThermalPrinterModule from 'react-native-thermal-printer';

const HomeDetail = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  // Function to scan Bluetooth devices
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
  const orderData = {
    store: "Kasirify Store",
    address: "Jl. Contoh No. 123",
    items: [
      { name: "Produk A asdas", qty: 2, price: 50000 },
      { name: "Produk B asd", qty: 1, price: 30000 },
      { name: "Produk C sda asdas asdasd", qty: 3, price: 15000 },
    ],
    total: 145000,
    thanksMessage: "Terima Kasih!\nSelamat Berbelanja!",
  };
  // Pilih perangkat
  const selectDevice = (device) => {
    setSelectedDevice(device);
    alert('Device Selected', `Anda memilih: ${device.deviceName}`);
  };

  // Function to print test text
  const printText = async () => {
    if (!selectedDevice) {
      alert('No Device', 'Silakan pilih perangkat terlebih dahulu.');
      return;
    }

    const formatCurrency = (value) => `Rp ${value.toLocaleString('id-ID')}`;

    const wrapText = (text, maxLength) => {
      const words = text.split(' ');
      let lines = [];
      let currentLine = '';
  
      words.forEach((word) => {
        if ((currentLine + word).length <= maxLength) {
          currentLine += word + ' ';
        } else {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        }
      });
  
      if (currentLine) lines.push(currentLine.trim());
  
      return lines;
    };
  
    // Header struk
    let payload = `\x1B\x33\x01
        ${orderData.store}
        ${orderData.address}
  ------------------------------
  Nama        Qty         Harga
  ------------------------------\n`;
  
    // Menambahkan setiap item ke dalam payload
    orderData.items.forEach((item) => {
      const wrappedName = wrapText(item.name, 13);
      wrappedName.forEach((line, index) => {
        if (index === 0) {
          payload += `${line.padEnd(15)} ${item.qty.toString().padEnd(3)} ${formatCurrency(item.price)}\n`;
        } else {
          payload += `${line}\n`;
        }
      });
    });
  
    // Menambahkan total dan pesan terima kasih
    payload += 
`--------------------------------
Total:       ${formatCurrency(orderData.total)}
--------------------------------
${orderData.thanksMessage}`;
  
    try {
      await ThermalPrinterModule.printBluetooth({
        payload: payload,
        device_name: selectedDevice.deviceName,
        address: selectedDevice.macAddress,
      });
      Alert.alert('Success', 'Cetak berhasil.');
    } catch (error) {
      Alert.alert('Error', `Gagal mencetak: ${error.message}`);
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
              <Text>{item.deviceName} ({item.macAddress})</Text>
            </TouchableOpacity>
          )}
        />
      </>
    )}

    {selectedDevice && (
      <View style={styles.printSection}>
        <Text style={styles.selectedDevice}>Perangkat Terpilih: {selectedDevice.deviceName}</Text>
        <Button title="Cetak Teks" onPress={printText} />
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
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
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
  },

});

export default HomeDetail;
