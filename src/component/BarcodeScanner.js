import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Svg, { Line } from 'react-native-svg'; // Import elemen SVG

const BarcodeScanner = ({ onCodeScanned, onCancel }) => {
    const [scannedData, setScannedData] = useState('');

    const handleScan = (e) => {
        console.log('Scanned Code:', e.data);  
        setScannedData(e.data);  // Menyimpan hasil scan
        onCodeScanned(e.data);  
    };
  
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={handleScan}  
          topContent={
            <Text style={styles.centerText}>
              Scan QR Code or Barcode
            </Text>
          }
          bottomContent={
            <Button title="Stop Scanner" onPress={onCancel}  />
          }
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerText: {
      fontSize: 18,
      padding: 16,
      color: '#000',
    },
  });
  
  export default BarcodeScanner;
  