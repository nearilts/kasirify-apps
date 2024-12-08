import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import usePostData from '../../../utils/usePostData';
import SearchableSelect from '../../../component/SearchableSelect';
import { BASE_URL } from '../../../const/url';

const BukaKasir = ({ navigation,onKasirUpdated,onsetModal }) => {
  const { postData, isLoading } = usePostData();
  const [formData, setFormData] = useState({
    amount_start: '',
    kasir_id: '',
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleNext = async () => {
    if (!formData.amount_start || !formData.kasir_id) {
      alert('Lengkapi Form Yang Tersedia.');
      return;
    }

    try {
      const response = await postData('transaksi/create-kasir', formData);
      console.log(onKasirUpdated)
      console.log(response.meta?.code)
      if (response.meta?.code === 200) {
        alert('Data Success Save');
        if (onKasirUpdated) {
          onKasirUpdated();
        }
      } else {
        alert('Gagal Simpan');
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Buka Kasir</Text>
      <SearchableSelect
        label="Kasir"
        apiEndpoint={`${BASE_URL}api/kasir`}
        onSelect={(item) => handleInputChange('kasir_id', item.id)}
        selectedValue={formData.kasir_id}
        placeholder="Select Kasir"
        labelKey="name"
        valueKey="id"
      />
      <Text>Saldo Awal Kasir</Text>
      <TextInput
        style={styles.input}
        placeholder="Saldo Awal Kasir "
          keyboardType="number-pad"
        value={formData.amount_start}
        onChangeText={(value) => handleInputChange('amount_start', value)}
      />
   
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleNext} />
      )}
      <View style={{marginTop:20}}>
      <Button title="Create Kasir" onPress={() => onsetModal()} />

      </View>
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

export default BukaKasir;
