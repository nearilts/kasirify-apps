import React, { useContext } from 'react';
import { View, Text,FlatList, TouchableOpacity  } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { ButtonLong, FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';

const ListCategory = ({ navigation }) => {
  const { datas: userData, isLoading } = useFetchData(navigation, 'category');
  const {setTokos} = useContext(AuthContext);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
        <View style={[styles.card90, { marginBottom: 5 }]}>
        <View style={{alignItems:'center'}}>
            <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{item?.name}</Text>
        </View>
        
        </View>
    </View>
   
  );

  const handleAddToko = () => {
    navigation.navigate('BuatCategory');
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
                <Text style={styles.loadingText}>Tidak Ada Kategori, Buat Kategori Baru</Text>
            </View>
            
            </>
          )}
        </>
      )}
        <FloatingButton
              iconName="assignment-add"
              onPress={handleAddToko}
              buttonText=" Kategori"
          />
       
    </View>
  );
};


export default ListCategory;
