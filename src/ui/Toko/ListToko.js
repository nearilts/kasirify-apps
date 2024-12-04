import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useFetchData from '../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';

const ListToko = ({ navigation }) => {
  const { datas: userData, isLoading } = useFetchData(navigation, 'list-toko');

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>List Toko</Text>
          <Button 
            title="Go to Home Detail"
            onPress={() => navigation.navigate('HomeDetail')}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default ListToko;
