import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';
import { formatNumber, formatPrice } from '../../../utils/Helper';
import useDeleteData from '../../../utils/useDeleteData';
import useFetchDataPage from '../../../utils/useFetchDataPage';

const ListProduct = ({ navigation }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { datas: userData, isLoading, refetch, fetchMore } = useFetchDataPage(navigation, 'product');
  const { setTokos } = useContext(AuthContext);
  const { deleteData } = useDeleteData();

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteData(`product/${productId}`);
      if (response.meta?.code === 200) {
        alert(response.meta?.messages);
        refetch();
      } else {
        alert(response.meta?.messages);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  const loadMoreData = async () => {
    if (userData?.data?.next_page_url) {
      setIsLoadingMore(true);
      await fetchMore(userData.data.next_page_url);
      setIsLoadingMore(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={[styles.card90, { marginBottom: 5 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
          <View style={styles.flexRowBetween}>
            <View style={styles.flexColumnBetween}>
              <Text style={[styles.text18, { fontWeight: 'bold', color: COLORS.primary }]}>{item?.name}</Text>
              <Text style={[styles.text18, { fontWeight: 'bold', color: COLORS.primary }]}>{formatPrice(item?.selling_price)}</Text>
              <Text style={[styles.text18, { fontWeight: 'bold', color: COLORS.primary }]}>{formatNumber(item?.stock)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddToko = () => {
    navigation.navigate('BuatProduct');
  };

  return (
    <View style={{ flex: 1 }}>
      {Array.isArray(userData?.data?.data) && userData.data?.data.length > 0 ? (
            <>
              <FlatList
                data={userData?.data?.data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />
              {userData?.data?.next_page_url && (
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
      <FloatingButton
        iconName="assignment-add"
        onPress={handleAddToko}
        buttonText=" Produk"
      />
    </View>
  );
};

export default ListProduct;
