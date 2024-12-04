import React, { useContext } from 'react';
import { View, Text,FlatList, TouchableOpacity  } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { ButtonLong, FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';
import useDeleteData from '../../../utils/useDeleteData';

const ListKasir = ({ navigation }) => {
  const { datas: userData, isLoading, refetch } = useFetchData(navigation, 'kasir');
  const {setTokos} = useContext(AuthContext);


  const { deleteData, isLoading: loadingdelete } = useDeleteData();
  const handleDelete = async (productId) => {
    try {
      const response = await deleteData('kasir/'+productId);
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
  const renderItem = ({ item }) => (
    <View style={styles.container}>
        <View style={[styles.card90, { marginBottom: 5 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('UbahKasir', { Id: item.id })}>
        <View style={styles.flexRowBetween}>
              <View style={styles.flexColumnBetween}>
                <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{item?.name}</Text>
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
    navigation.navigate('BuatKasir');
  };

  return (
    <View style={{flex:1}}>
      <Spinner visible={isLoading} />
      
      {isLoading ? (
        <View style={styles.container}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {Array.isArray(userData?.data) && userData.data.length > 0 ? (
            <>
            <FlatList
                data={userData?.data} 
                renderItem={renderItem} 
                keyExtractor={(item) => item.id.toString()} 
            />
            
            </>
          ) : (
            <>
            <View style={styles.container}>
                <Text style={styles.loadingText}>Tidak Ada Kasir, Buat Kasir Baru</Text>
            </View>
            
            </>
          )}
        </>
      )}
        <FloatingButton
              iconName="assignment-add"
              onPress={handleAddToko}
              buttonText=" Kasir"
          />
       
    </View>
  );
};


export default ListKasir;
