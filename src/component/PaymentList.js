// PaymentList.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../const/styles'; // Sesuaikan dengan path file styles Anda
import COLORS from '../const/color';
import { formatNumber } from '../utils/Helper';

const PaymentList = ({ item, selectedCategory, onSelect }) => {
  return (
    <View style={{ marginBottom: 20, marginTop:20 }}>
        <TouchableOpacity onPress={() => onSelect(item.paymentMethod)}>
        <View
        style={[
          styles.card90,
          {
            marginHorizontal: 10,
            backgroundColor: selectedCategory === item.paymentMethod ? COLORS.primary2 : COLORS.primary,
            borderRadius: 5,
          },
        ]}
      > 
      <View style={styles.flexRowaround}>
      <Image source={{ uri: item.paymentImage }} style={{height:50, width:50,backgroundColor:COLORS.white, marginRight:5, borderRadius:10}}  resizeMode="contain" />
      <View style={styles.flexColumnBetween}>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.white }]}>{item?.paymentName}</Text>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.white }]}> Fee : {formatNumber(item?.totalFee)}</Text>
          </View>
      </View>
        
      </View>
        </TouchableOpacity>
        </View>
  );
};

export default PaymentList;
