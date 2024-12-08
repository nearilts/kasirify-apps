import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { PrintInfo } from '../utils/GetDataSession';
import { formatNumber } from '../utils/Helper';

const PrinterComponent = ({ printData,navigation }) => {
  const { printDevice } = PrintInfo();

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
  const printText = async () => {
    if (!printDevice) {
      alert('No Device', 'Silakan pilih perangkat terlebih dahulu.');
      return;
    }
    console.log('printData,: ', printData.data)
  

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
        ${printData.data.toko.name}
        ${printData.data.toko.address}
        ${printData.data.invoice}
  ------------------------------\n`;
  
    // Menambahkan setiap item ke dalam payload
    printData.data.detail.forEach((item) => {
      const wrappedName = wrapText(item.product.name, 30);
      wrappedName.forEach((line, index) => {
        if (index === 0) {
          payload += `${line.padEnd(30)}\n`;
          payload += `${item.qty.toString().padEnd(2)} X Rp.${formatNumber(item.price)}       Rp.${formatNumber(item.total_amount)} \n`;
        } else {
          payload += `${line}\n`;
        }
      });
    });
  
    // Menambahkan total dan pesan terima kasih
    payload += 
`--------------------------------
Sub Total       Rp.${formatNumber(printData.data.amount)}
Diskon          Rp.${formatNumber(printData.data.amount_discount ? printData.data.amount_discount : 0)}
Total           Rp.${formatNumber(printData.data.total_amount)}
Bayar           Rp.${formatNumber(printData.data.amount_paid)}
Kembali         Rp.${formatNumber(printData.data.amount_remaining)}
--------------------------------
 Terima Kasih Sudah Berbelanja
          kasirify.com`;


    try {
      await ThermalPrinterModule.printBluetooth({
        payload: payload,
        device_name: printDevice.deviceName,
        address: printDevice.macAddress,
      });
      alert('Success', 'Cetak berhasil.');
    //   navigation.goBack()
    } catch (error) {
      alert('Error', `Gagal mencetak: ${error.message}`);
    }
  };


  return (
    <View style={styles.container}>
      {printDevice?.deviceName ? (
        <>
          <Text>Printer Aktif: {printDevice.deviceName}</Text>
          <Button title="Print" onPress={printText} />
        </>
      ) : (
        <Button 
        title="Setting Printer"
        onPress={() => navigation.navigate("SettingPrinter")}
    />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
  },
});

export default PrinterComponent;
