import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList, Modal, ScrollView  } from 'react-native';
import usePostData from '../../../utils/usePostData';
import SearchableSelect from '../../../component/SearchableSelect';
import { BASE_URL } from '../../../const/url';
import BarcodeScanner from '../../../component/BarcodeScanner';

const BuatProduct = ({ navigation }) => {
  const { postData, isLoading } = usePostData();
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    code: '',
    stock: '',
    basic_price: '',
    selling_price: '',
    min_stock: '',
    discount: '',
    rack: '',
    information: '',
    price_grosir: [],
  });
  const [scannerVisible, setScannerVisible] = useState(false);

  const [grosirEntry, setGrosirEntry] = useState({ name: '', min: '', price: '' });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const addGrosirPrice = () => {
    if (!grosirEntry.name || !grosirEntry.min || !grosirEntry.price) {
      alert('Lengkapi data grosir.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      price_grosir: [...prev.price_grosir, grosirEntry],
    }));
    setGrosirEntry({ name: '', min: '', price: '' });
  };

  const handleNext = async () => {
    // Validation
    if (!formData.category_id || !formData.name || !formData.code || !formData.selling_price) {
      alert('Lengkapi form yang tersedia.');
      return;
    }

    try {
      const response = await postData('product', formData);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Buat Product</Text>

      <SearchableSelect
        label="Category"
        apiEndpoint={`${BASE_URL}api/category`}
        onSelect={(item) => handleInputChange('category_id', item.id)}
        selectedValue={formData.category_id}
        placeholder="Select Category"
        labelKey="name"
        valueKey="id"
      />

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <Text>Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Scan or enter manually"
        value={formData.code}
        onChangeText={(value) => handleInputChange('code', value)}
        keyboardType="number-pad"
      />
       <Button title="Scan Barcode" onPress={() => setScannerVisible(true)} />
       <Modal visible={scannerVisible} animationType="slide">
        <BarcodeScanner
          onCodeScanned={(code) => {
            setScannerVisible(false);
            handleInputChange('code', code);
          }}
          onCancel={() => setScannerVisible(false)}
        />
      </Modal>
      <Text>Stock</Text>
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={formData.stock}
        onChangeText={(value) => handleInputChange('stock', value)}
        keyboardType="number-pad"
      />

      <Text>Basic Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Basic Price"
        value={formData.basic_price}
        onChangeText={(value) => handleInputChange('basic_price', value)}
        keyboardType="number-pad"
      />

      <Text>Selling Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Selling Price"
        value={formData.selling_price}
        onChangeText={(value) => handleInputChange('selling_price', value)}
        keyboardType="number-pad"
      />

      <Text>Rack</Text>
      <TextInput
        style={styles.input}
        placeholder="Rack"
        value={formData.rack}
        onChangeText={(value) => handleInputChange('rack', value)}
      />

      <Text>Min Stock</Text>
      <TextInput
        style={styles.input}
        placeholder="Min Stock"
        value={formData.min_stock}
        onChangeText={(value) => handleInputChange('min_stock', value)}
        keyboardType="number-pad"
      />

      <Text>Discount (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Discount"
        value={formData.discount}
        onChangeText={(value) => handleInputChange('discount', value)}
        keyboardType="number-pad"
      />

      <Text>Grosir Prices</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={grosirEntry.name}
        onChangeText={(value) => setGrosirEntry({ ...grosirEntry, name: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Min Qty"
        value={grosirEntry.min}
        onChangeText={(value) => setGrosirEntry({ ...grosirEntry, min: value })}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={grosirEntry.price}
        onChangeText={(value) => setGrosirEntry({ ...grosirEntry, price: value })}
        keyboardType="number-pad"
      />
      <View style={{marginTop:20, marginBottom:20}}>
        <Button title="Add Grosir" onPress={addGrosirPrice} />
      </View>
      

      <FlatList
        data={formData.price_grosir}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{`${item.name} - Min: ${item.min}, Price: ${item.price}`}</Text>
        )}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{marginBottom:55}}>
          <Button title="Submit" onPress={handleNext} />
        </View>
        
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default BuatProduct;
