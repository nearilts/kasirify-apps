import React, { useContext } from 'react';
import { View, Text,FlatList, TouchableOpacity  } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { ButtonLong, FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';
import { formatNumber, formatPrice } from '../../../utils/Helper';

const ListProduct = ({ navigation }) => {
  const { datas: userData, isLoading } = useFetchData(navigation, 'product');
  const {setTokos} = useContext(AuthContext);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
        <View style={[styles.card90, { marginBottom: 5 }]}>
          
        <View style={styles.flexRowBetween}>
          <View style={styles.flexColumnBetween}>
            <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{item?.name}</Text>
            <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{formatPrice(item?.selling_price)}</Text>
            <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{formatNumber(item?.stock) }</Text>
          </View>
          <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{item?.name}</Text>
        </View>

        
        
        </View>
    </View>
   
  );

  const handleAddToko = () => {
    navigation.navigate('BuatProduct');
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
          {Array.isArray(userData?.data?.data) && userData.data?.data.length > 0 ? (
            <>
            <FlatList
                data={userData?.data?.data} 
                renderItem={renderItem} 
                keyExtractor={(item) => item.id.toString()} 
            />
            
          
            </>
          ) : (
            <>
            <View style={styles.container}>
                <Text style={styles.loadingText}>Tidak Ada Produk, Buat Produk Baru</Text>
            </View>
            
            </>
          )}
        </>
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
