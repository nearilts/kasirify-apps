import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList, Modal, ScrollView, TouchableOpacity } from 'react-native';
import usePutData from '../../../utils/usePutData'; // Custom hook untuk update data
import useFetchData from '../../../utils/useFetchData'; // Custom hook untuk fetch data produk
import SearchableSelect from '../../../component/SearchableSelect';
import { BASE_URL } from '../../../const/url';
import BarcodeScanner from '../../../component/BarcodeScanner';
import COLORS from '../../../const/color';

const EditProduct = ({ navigation, route }) => {
  const { productId } = route.params; // Ambil productId dari route params
  const { datas: productData, isLoading: isFetching } = useFetchData(navigation, `product/${productId}`);
 
  const { putData, isLoading } = usePutData();

  const [formData, setFormData] = useState({
    category_id: '',
    category_name: '',
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

  
  useEffect(() => {
    if (productData?.data) {
  
      setFormData((prev) => ({
        ...prev,
        ...productData?.data,
      }));
    }
   
  }, [productData]);
  
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

  const updateGrosirPrice = (index, key, value) => {
    const updatedGrosir = [...formData.price_grosir];
    updatedGrosir[index][key] = value;
    setFormData({ ...formData, price_grosir: updatedGrosir });
  };

  const removeGrosirPrice = (index) => {
    setFormData((prev) => ({
      ...prev,
      price_grosir: prev.price_grosir.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.category_id || !formData.name || !formData.code || !formData.selling_price) {
      alert('Lengkapi form yang tersedia.');
      return;
    }

    try {
      const response = await putData(`product/${productId}`, formData);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      {isFetching ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <SearchableSelect
            label="Category"
            apiEndpoint={`${BASE_URL}api/category`}
            onSelect={(item) => handleInputChange('category_id', item.id)}
            selectedValue={formData.category_id}
            selectedLabel={formData.category_name}
            placeholder="Select Category"
            labelKey="name"
            valueKey="id"
          />

          <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Name</Text>
          <TextInput
        placeholderTextColor={COLORS.dark}
            style={styles.input}
            placeholder="Product Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />

          <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Code</Text>
          <View style={styles.row}>
            <TextInput
        placeholderTextColor={COLORS.dark}
              style={[styles.input, styles.flexInput]}
              placeholder="Scan or enter manually"
              value={formData.code}
              onChangeText={(value) => handleInputChange('code', value)}
              keyboardType="number-pad"
            />
            <Button title="Scan Barcode" onPress={() => setScannerVisible(true)} />
          </View>
          <Modal visible={scannerVisible} animationType="slide">
            <BarcodeScanner
              onCodeScanned={(code) => {
                setScannerVisible(false);
                handleInputChange('code', code);
              }}
              onCancel={() => setScannerVisible(false)}
            />
          </Modal>

        <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Stock</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Stock"
        value={formData.stock}
        onChangeText={(value) => handleInputChange('stock', value)}
        keyboardType="number-pad"
      />

      <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Basic Price</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Basic Price"
        value={formData.basic_price}
        onChangeText={(value) => handleInputChange('basic_price', value)}
        keyboardType="number-pad"
      />

      <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Selling Price</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Selling Price"
        value={formData.selling_price}
        onChangeText={(value) => handleInputChange('selling_price', value)}
        keyboardType="number-pad"
      />

      <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Rack</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Rack"
        value={formData.rack}
        onChangeText={(value) => handleInputChange('rack', value)}
      />

      <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Min Stock</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Min Stock"
        value={formData.min_stock}
        onChangeText={(value) => handleInputChange('min_stock', value)}
        keyboardType="number-pad"
      />

      <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Discount (%)</Text>
      <TextInput
        placeholderTextColor={COLORS.dark}
        style={styles.input}
        placeholder="Discount"
        value={formData.discount}
        onChangeText={(value) => handleInputChange('discount', value)}
        keyboardType="number-pad"
      />

          <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Grosir Prices</Text>
          <FlatList
            data={formData.price_grosir}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <TextInput
        placeholderTextColor={COLORS.dark}
                  style={styles.input}
                  value={item.name}
                  placeholder="Name"
                  onChangeText={(value) => updateGrosirPrice(index, 'name', value)}
                />
                <TextInput
        placeholderTextColor={COLORS.dark}
                  style={styles.input}
                  value={item.min}
                  placeholder="Min Qty"
                  keyboardType="number-pad"
                  onChangeText={(value) => updateGrosirPrice(index, 'min', value)}
                />
                <TextInput
        placeholderTextColor={COLORS.dark}
                  style={styles.input}
                  value={item.price}
                  placeholder="Price"
                  keyboardType="number-pad"
                  onChangeText={(value) => updateGrosirPrice(index, 'price', value)}
                />
                <TouchableOpacity onPress={() => removeGrosirPrice(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={{ marginBottom: 55, marginTop: 20 }}>
              <Button title="Update" onPress={handleSubmit} />
            </View>
          )}
        </>
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
        color:COLORS.dark,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },  
      flexInput: {
        flex: 1, // Membuat input mengisi ruang kosong
        marginRight: 10, // Memberi jarak antara input dan tombol
      },
      input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color:COLORS.dark,
      },
});

export default EditProduct;
