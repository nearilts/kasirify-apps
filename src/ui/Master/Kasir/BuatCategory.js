import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import usePostData from '../../../utils/usePostData';
import SearchableSelect from '../../../component/SearchableSelect';
import { BASE_URL } from '../../../const/url';

const BuatKasir = ({ navigation }) => {
  const { postData, isLoading } = usePostData();
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleNext = async () => {
    if (!formData.name) {
      alert('Lengkapi Form Yang Tersedia.');
      return;
    }

    try {
      const response = await postData('kasir', formData);
      if (response.meta?.code === 200) {
        alert('Data Success Save');
        navigation.goBack()
      } else {
        alert('Gagal Simpan');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Kasir</Text>

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
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

export default BuatKasir;