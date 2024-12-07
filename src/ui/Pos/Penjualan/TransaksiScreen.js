import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, Text, FlatList, TouchableOpacity, Button, ScrollView } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';
import { formatNumber, formatPrice } from '../../../utils/Helper';
import useDeleteData from '../../../utils/useDeleteData';
import useFetchDataPage from '../../../utils/useFetchDataPage';
import { TextInput } from 'react-native-gesture-handler';
import BarcodeScanner from '../../../component/BarcodeScanner';
import BukaKasir from './BukaKasir';
import CategoryItem from '../../../component/CategoryItem';
import ProductItem from '../../../component/ProductItem';
import Toast from 'react-native-simple-toast';
import usePostData from '../../../utils/usePostData';
import Icon from 'react-native-vector-icons/MaterialIcons'

const TransaksiScreen = ({ navigation  }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { datas: cekKasir, isLoading:loadingkasir, refetch:fetchDatas } = useFetchData(navigation, 'transaksi/cek-kasir');
  const { datas: DataProduct, isLoading, refetch, fetchMore } = useFetchDataPage(navigation, 'product');
  const { datas: Datacategory, isLoading:loadingcategory  } = useFetchData(navigation, 'category');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    code: '',
  });
  const { datas: Datacart, isLoading:loadingcart,refetch:cekCartLagi  } = useFetchData(navigation, 'transaksi/list-cart');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { postData, isLoading:postdata } = usePostData();

  const loadMoreData = async () => {
    if (DataProduct?.data?.next_page_url) {
      setIsLoadingMore(true);
      await fetchMore(DataProduct.data.next_page_url);
      setIsLoadingMore(false);
    }
  };

  const renderItem = ({ item }) => (
    <ProductItem
        item={item}
        onPress={(id, qty) => handleAddCart(id, qty)}
        color={COLORS.primary2}
        icon="add-shopping-cart"
        onUpdate={(id, qty) => handleAddCart(id, qty)}

      />
  );

  const rendercategory = ({ item }) => (
    <CategoryItem
      item={item}
      selectedCategory={selectedCategory}
      onSelect={(id) => handleCategory(id)}
    />
  );

  const handleCategory = (id) => {
    console.log('Selected Category ID:', id); 

    refetch(`&category_id=${id}`)
    setSelectedCategory(id);
  };

  const handlePostAddcart = async (id, qty) => {
    try {
      const response = await postData('transaksi/add-cart', {product_id : id, qty: qty});
      if (response.meta?.code === 200) {
        Toast.show('Berhasil ditambahkan ke Keranjang.');
        cekCartLagi()
        setFormData({
          category_id: '',
          name: '',
          code: '',
        })
        setSelectedCategory(null);
        
      } else {
        Toast.show(response.data?.messages);
      }
    } catch (error) {
      Toast.show('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleAddCart = (id, qty) => {
    console.log(' ID:', id); 
    console.log(' qty:', qty); 
    if (qty === 0) {
      qty = 1
    }
    handlePostAddcart(id, qty)
    
   
  };

  const handleAddToko = () => {
    navigation.navigate('BuatProduct');
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });

    if (key === 'name') {
      refetch(`&name=${value}`)
    }else if(key === 'code'){
      refetch(`&code=${value}`)
    }
  };
  useEffect(() => {
    if (!cekKasir) {
      setIsModalVisible(false); 
    } else if (cekKasir.meta.code !== 200) {
      setIsModalVisible(true); 
    } else {
      setIsModalVisible(false); 
    }
  }, [cekKasir]);


  return (
    <View style={{ flex: 1 }}>

        <Modal animationType="slide" visible={isModalVisible}>
          <BukaKasir
            navigation={navigation}
            onKasirUpdated={() => {
              fetchDatas();
            }}
          />
        </Modal>


        <View style={styles.flexRowaround}>
        <TextInput
        style={[styles.input,{width:220}]}
        placeholder="Product Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        />
      <TextInput
          style={[styles.input,{width:150}]}
          placeholder="Barcode"
          value={formData.code}
          onChangeText={(value) => handleInputChange('code', value)}
        />
        </View>
        
        <View style={{height: 50, marginLeft:15, marginRight:15}}>
          <Button title="Scan Barcode" onPress={() => setScannerVisible(true)} />
        </View>
            <View style={{marginLeft:15, marginRight:15, marginBottom:15, backgroundColor:COLORS.primary, borderRadius:10}}>
              <TouchableOpacity style={{height: 50, width:'100%', justifyContent: 'center',alignItems:'center'}} activeOpacity={0.8}  onPress={() => handleAddToko()}>
            
                  <View style={{flexDirection:'row'}}>
                  <Icon name="assignment-add" size={22} color={COLORS.white} />
                  <Text style={{color:COLORS.white, fontWeight:'bold', fontSize:18}}>
                      Tambah Produk
                  </Text>
              </View>
          
              </TouchableOpacity>
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
      <ScrollView>
        <FlatList
          data={Datacategory?.data}
          renderItem={rendercategory}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
        />
        {Array.isArray(DataProduct?.data?.data) && DataProduct.data?.data.length > 0 ? (
          <>
            <FlatList
              data={DataProduct?.data?.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 20,
              }}
            />
            {DataProduct?.data?.next_page_url && (
              <TouchableOpacity onPress={loadMoreData} style={{ marginTop: 5, marginBottom: 20, marginHorizontal: 60 }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                  }}>
                  <Text style={styles.loadMoreText}>
                    {isLoadingMore ? 'Memuat lebih banyak...' : 'Load More Product'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.container}>
            <Text style={styles.loadingText}>Tidak Ada Produk, Buat Produk Baru</Text>
            
          </View>
        )}
      </ScrollView>
            <TouchableOpacity  style={[styles.loadMoreButton, {flexDirection:'row', justifyContent:'center'}]} onPress={() => navigation.navigate("KeranjangScreen")}>
            <Icon name="shopping-cart" size={22} color={COLORS.white} />
              <Text style={styles.loadMoreText}>
                Keranjang ({Datacart?.data.sub_total_qty}) - ({formatPrice(Datacart?.data.sub_total_amount)})
              </Text>
            </TouchableOpacity>
    </View>
  );
};

export default TransaksiScreen;
