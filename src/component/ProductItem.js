import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from '../const/styles'; // Sesuaikan path styles
import COLORS from '../const/color'; // Sesuaikan path COLORS
import { formatPrice } from '../utils/Helper'; // Sesuaikan path Helper
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductItem = ({ item, onPress, color, icon, onUpdate }) => {
  const [qty, setQty] = useState(item?.qty ? item?.qty : 0); // State untuk kuantitas
  const [inputText, setInputText] = useState(String(item?.qty ? item?.qty : 0)); // Menyimpan input sementara
  const [timeoutId, setTimeoutId] = useState(null); // Menyimpan id timeout untuk debounce

  const handleIncrease = () => {
    setQty((prevQty) => {
        const currentQty = isNaN(prevQty) ? 0 : parseFloat(prevQty); 
        const newQty = currentQty + 1;
        onUpdate(item.product_id ? item.product_id : item.id, newQty);
        setInputText(String(newQty)); 
        return newQty;
    });
  };

  // Fungsi untuk mengurangi qty
  const handleDecrease = () => {
    setQty((prevQty) => {
        const currentQty = isNaN(prevQty) ? 0 : parseFloat(prevQty);
        const newQty = currentQty > 0 ? currentQty - 1 : 0; // Mengurangi 1 jika lebih besar dari 0
        onUpdate(item.product_id ? item.product_id : item.id, newQty);
        setInputText(String(newQty)); 
        return newQty;
    });
  };

  // Fungsi untuk menangani perubahan qty melalui TextInput
  const handleQtyChange = (text) => {
    setInputText(text); // Menyimpan input sementara

    if (timeoutId) {
      clearTimeout(timeoutId); // Bersihkan timeout sebelumnya
    }

    // Menunggu selama 500ms setelah pengguna berhenti mengetik
    const newTimeoutId = setTimeout(() => {
      // Ganti koma dengan titik
      let formattedText = text.replace(',', '.'); 

      // Cek apakah nilai input valid (angka desimal atau integer)
      const value = parseFloat(formattedText);
      if (!isNaN(value) && value >= 0) {
        setQty(value); // Update qty hanya jika input valid
        onUpdate(item.product_id ? item.product_id : item.id, value); // Kirimkan perubahan ke parent
      } else if (text === '') {
        setQty(0); // Reset ke 0 jika input kosong
      }
    }, 500); // Tunggu selama 500ms setelah pengguna berhenti mengetik

    setTimeoutId(newTimeoutId); // Simpan id timeout yang baru
  };

  return (
    <View style={[styles.container, {  }]}>
      <View style={[styles.card90, {}]}>
        <View style={[styles.flexRowaround]}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.dark, width: 160 }]}>
              {item?.name}
            </Text>
            <Text style={[styles.text15, { color: COLORS.dark }]}>
              {formatPrice(item.selling_price ? item.selling_price : item.price)}
            </Text>
            <Text style={[styles.text15, { color: COLORS.dark }]}>{item?.category_name}</Text>
          </View>
          <View style={[styles.flexRowBetween, { alignItems: 'center' }]}>
            <TouchableOpacity
              onPress={handleDecrease}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 5,
                marginRight: 5,
                height: 30,
                width: 30,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: COLORS.white, fontWeight: 'bold' }}>-</Text>
            </TouchableOpacity>
            <TextInput
              value={inputText} // Menampilkan input text yang masih dalam proses
              style={{
                borderWidth: 1,
                borderColor: COLORS.primary,
                width: 50,
                textAlign: 'center',
                borderRadius: 5,
              }}
              keyboardType="decimal-pad" // Menggunakan keyboard untuk input desimal
              onChangeText={handleQtyChange} // Memanggil handleQtyChange untuk update kuantitas
            />
            <TouchableOpacity
              onPress={handleIncrease}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 5,
                marginLeft: 5,
                height: 30,
                width: 30,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: COLORS.white, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => onPress(item.product_id ? item.product_id : item.id, qty)}>
              <View
                style={{
                  marginLeft: 10,
                  height: 45,
                  width: 45,
                  backgroundColor: color,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name={icon} size={22} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductItem;
