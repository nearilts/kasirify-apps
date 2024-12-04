import React, { useContext } from 'react';
import { View, Text,FlatList, TouchableOpacity  } from 'react-native';
import useFetchData from '../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../const/styles';
import { ButtonLong, FloatingButton } from '../../component/FloatingButton';
import COLORS from '../../const/color';
import { AuthContext } from '../../context/AuthContext';

const ListToko = ({ navigation }) => {
  const { datas: userData, isLoading } = useFetchData(navigation, 'list-toko');
  const {setTokos} = useContext(AuthContext);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
        <View style={[styles.card90, { marginBottom: 15 }]}>
        <View style={{alignItems:'center'}}>
            <Text style={[styles.text18,{fontWeight:'bold',color:COLORS.primary}]}>{item?.toko.name}</Text>
        </View>
        <View style={styles.flexRowBetween}>
            <Text style={styles.text15}>Expired : {item?.toko.expired}</Text>
            <Text style={[styles.text18, {color:COLORS.grey}]}>{item?.toko.type}</Text>
        </View>
        <View>
            <ButtonLong
                iconName="login"
                onPress={() => handleToko(item)}
                buttonText="Masuk"
            />
        </View>
        </View>
    </View>
   
  );

  const handleAddToko = () => {
    navigation.navigate('AddTokoScreen');
  };

  const handleToko = (item) => {
    setTokos(item)
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
         <FlatList
            data={userData?.data} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id.toString()} 
        />
        <FloatingButton
            iconName="assignment-add"
            onPress={handleAddToko}
            buttonText="Tambah Toko"
        />
        
        </>
      )}

      
       
    </View>
  );
};


export default ListToko;
