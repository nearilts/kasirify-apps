import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import usePutData from '../../../utils/usePutData';
import useFetchData from '../../../utils/useFetchData';

const UbahPelanggan = ({ navigation, route  }) => {
  const { Id } = route.params; // Ambil Id dari route params
  const { datas: Datas, isLoading: isFetching } = useFetchData(navigation, `customer/${Id}`);
  const { putData, isLoading } = usePutData();
  
  const [formData, setFormData] = useState({
    name: '',
  });
  useEffect(() => {
    if (Datas?.data) {
      setFormData({
        ...formData,
        ...Datas.data, // Isi form dengan data produk yang ada
      });
    }
  }, [Datas]);
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleNext = async () => {
    if (!formData.name) {
      alert('Lengkapi Form Yang Tersedia.');
      return;
    }

    try {
        const response = await putData(`customer/${Id}`, formData);
        if (response.meta?.code === 200) {
          alert('Data berhasil diperbarui.');
          navigation.goBack();
        } else {
          alert(response.meta?.messages);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menyimpan data.');
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Pelanggan</Text>

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
          keyboardType="email-address"
        onChangeText={(value) => handleInputChange('email', value)}
      />

      <Text>Phone</Text>
      <TextInput
        style={styles.input}
          placeholder="Phone (628*********)"
          keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleNext} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default UbahPelanggan;
