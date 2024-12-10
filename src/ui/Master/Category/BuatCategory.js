import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import usePostData from '../../../utils/usePostData';
import SearchableSelect from '../../../component/SearchableSelect';
import { BASE_URL } from '../../../const/url';
import COLORS from '../../../const/color';
import styles from '../../../const/styles';

const BuatCategory = ({ navigation }) => {
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
      const response = await postData('category', formData);
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
    <View style={styles.containercenter}>
      <Text style={styles.title}>Buat Kategori</Text>

      <Text style={{color:COLORS.dark}}>Name</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
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


export default BuatCategory;
