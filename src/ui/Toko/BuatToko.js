import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import usePostData from '../../utils/usePostData';
import SearchableSelect from '../../component/SearchableSelect';
import { BASE_URL } from '../../const/url';
import COLORS from '../../const/color';

const BuatToko = ({ navigation }) => {
  const { postData, isLoading } = usePostData();
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    country: '',
    category: { id: '', label: '' },
    province: { id: '', label: '' },
    city: { id: '', label: '' },
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleNext = async () => {
    if (!formData.name || !formData.phone || !formData.country || !formData.province || !formData.city) {
      alert('Lengkapi Form Yang Tersedia.');
      return;
    }

    try {
      const response = await postData('toko', formData);
      if (response.meta?.code === 200) {
        alert('Data Success Save');
        navigation.replace('LoginScreen');
      } else {
        alert('Gagal Simpan');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Toko</Text>

      <Text>Name</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <Text>Phone</Text>

      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        value={formData.phone}
        placeholder="Phone (628*********)"
        keyboardType="phone-pad"
        onChangeText={(value) => handleInputChange('phone', value)}
      />
      <Text>Country</Text>

      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Country"
        value={formData.country}
        onChangeText={(value) => handleInputChange('country', value)}
      />
      <SearchableSelect
        label="Category"
        apiEndpoint={`${BASE_URL}api/category_toko`}
        onSelect={(item) => handleInputChange('category', item)}
        selectedValue={formData.category.label}
        placeholder="Select Category"
        labelKey="name"
        valueKey="id"
      />

      <SearchableSelect
        label="Province"
        apiEndpoint={`${BASE_URL}api/provincy`}
        onSelect={(item) => handleInputChange('province', item)}
        selectedValue={formData.province.label}
        placeholder="Select Province"
        labelKey="province"
        valueKey="id"
      />

      <SearchableSelect
        label="City"
        apiEndpoint={`${BASE_URL}api/kota?id=${formData.province.id}`}
        onSelect={(item) => handleInputChange('city', item)}
        selectedValue={formData.city.label}
        placeholder="Select City"
        labelKey="city"
        valueKey="id"
      />
      <Text>Address</Text>

        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
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
    color:COLORS.dark
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color:COLORS.dark,
  },
});

export default BuatToko;
