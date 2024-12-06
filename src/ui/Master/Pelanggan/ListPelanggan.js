import React, { useContext, useState } from 'react';
import { View, Text,FlatList, TouchableOpacity  } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { ButtonLong, FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';
import useDeleteData from '../../../utils/useDeleteData';
import useFetchDataPage from '../../../utils/useFetchDataPage';

const ListPelanggan = ({ navigation }) => {
  const {setTokos} = useContext(AuthContext);
  const { datas: userData, isLoading, refetch } = useFetchDataPage(navigation, 'customer');
  const { deleteData, isLoading: loadingdelete } = useDeleteData();
  const handleDelete = async (productId) => {
    try {
      const response = await deleteData('customer/'+productId);
      if (response.meta?.code === 200) {
        alert(response.meta?.messages);
        refetch();
      } else {
        alert(response.meta?.messages);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
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
        <TouchableOpacity onPress={() => navigation.navigate('UbahPelanggan', { Id: item.id })}>
        <View style={styles.flexRowBetween}>
              <View style={styles.flexColumnBetween}>
                <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{item?.name}</Text>
                <Text style={[styles.text15,{fontWeight:'bold',color:COLORS.dark}]}>{item?.email}</Text>
                <Text style={[styles.text15,{fontWeight:'bold',color:COLORS.dark}]}>{item?.phone }</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Hapus</Text>
            </TouchableOpacity>
            </View>
          </TouchableOpacity>

        </View>
    </View>
   
  );

  const handleAddToko = () => {
    navigation.navigate('BuatPelanggan');
  };

  return (
    <View style={{flex:1}}>
      
      {Array.isArray(userData?.data?.data) && userData.data.data.length > 0 ? (
            <>
            <FlatList
                data={userData?.data?.data} 
                renderItem={renderItem} 
                keyExtractor={(item) => item.id.toString()} 
            />
            {userData?.data?.next_page_url && (
                <TouchableOpacity onPress={loadMoreData} style={styles.loadMoreButton}>
                  <Text style={styles.loadMoreText}>
                    {isLoadingMore ? 'Memuat lebih banyak...' : 'Load More'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
            <View style={styles.container}>
                <Text style={styles.loadingText}>Tidak Ada Pelanggan, Buat Pelanggan Baru</Text>
            </View>
            
            </>
          )}
        <FloatingButton
              iconName="assignment-add"
              onPress={handleAddToko}
              buttonText=" Pelanggan"
          />
       
    </View>
  );
};


export default ListPelanggan;
