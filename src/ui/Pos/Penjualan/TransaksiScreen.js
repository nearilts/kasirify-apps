import React, { useContext, useState } from 'react';
import { View, Modal, Text, FlatList, TouchableOpacity, Button } from 'react-native';
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

const TransaksiScreen = ({ navigation  }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { datas: DataProduct, isLoading, refetch, fetchMore } = useFetchDataPage(navigation, 'product');
  const { datas: Datacategory, isLoading:loadingcategory  } = useFetchData(navigation, 'category');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [ModalKasir, setModalKasir] = useState(true);

  const { datas: cekKasir, isLoading:loadingkasir, refetch:fetchDatas } = useFetchData(navigation, 'transaksi/cek-kasir');
  

  const loadMoreData = async () => {
    if (DataProduct?.data?.next_page_url) {
      setIsLoadingMore(true);
      await fetchMore(DataProduct.data.next_page_url);
      setIsLoadingMore(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={[styles.card90, { marginBottom: 5 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
          <View style={styles.flexRowBetween}>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.dark }]}>{item?.name}</Text>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.dark }]}>{formatPrice(item?.selling_price)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const rendercategory = ({ item }) => (
    <View style={{ marginBottom:35}}>
      <View style={[styles.card90, { height:60,
          marginHorizontal: 10, 
          backgroundColor: COLORS.white,
          borderRadius: 5,}]}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
          <View style={styles.flexRowBetween}>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.dark }]}>{item?.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleAddToko = () => {
    navigation.navigate('BuatProduct');
  };
  const handleInputChange = (key, value) => {
   
  };
  const SaveKasir = () => {
  };
  return (
    <View style={{ flex: 1 }}>

        <Modal animationType="slide" visible={cekKasir?.meta.code !== 200}>
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
        value=""
        onChangeText={(value) => handleInputChange('name', value)}
        />
      <TextInput
          style={[styles.input,{width:150}]}
          placeholder="Barcode"
          value=""
          onChangeText={(value) => handleInputChange('name', value)}
        />
        </View>
        
        <View style={{height: 50, marginLeft:15, marginRight:15}}>
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
              />
              {DataProduct?.data?.next_page_url && (
                <TouchableOpacity onPress={loadMoreData} style={{ marginTop:5, marginBottom:20,marginLeft:60, marginRight:60 }}>
                  <View style={{justifyContent:'center', alignItems:'center', height:50, backgroundColor:COLORS.primary, borderRadius:10}}>
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

            <TouchableOpacity  style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>
                Keranjang (1)
              </Text>
            </TouchableOpacity>
    </View>
  );
};

export default TransaksiScreen;
