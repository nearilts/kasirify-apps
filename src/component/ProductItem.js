// ProductItem.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from '../const/styles'; // Sesuaikan path styles
import COLORS from '../const/color'; // Sesuaikan path COLORS
import { formatPrice } from '../utils/Helper'; // Sesuaikan path Helper
import Icon from 'react-native-vector-icons/MaterialIcons'

const ProductItem = ({ item, onPress }) => {
  const [qty, setQty] = useState(0); // State untuk kuantitas

  // Fungsi untuk menambah/mengurangi qty
  const handleIncrease = () => setQty((prevQty) => prevQty + 1);
  const handleDecrease = () => setQty((prevQty) => (prevQty > 0 ? prevQty - 1 : 0));

  return (
    <View style={[styles.container, { paddingVertical: 10 }]}>
      <View style={[styles.card90, { marginBottom: 5 }]}>
        
        <View style={[styles.flexRowaround]}>
            <View style={{
                flexDirection:'column'
                }}>
                <Text  style={[
                        styles.text15,
                        { fontWeight: 'bold', color: COLORS.dark, width: 160 }, // Lebar tetap
                    ]}
                >{item?.name} </Text>
                <Text style={[styles.text15, {  color: COLORS.dark }]}>{formatPrice(item?.selling_price)}</Text>
                <Text style={[styles.text15, {  color: COLORS.dark }]}>{item?.category_name}</Text>
            </View>
            <View style={[styles.flexRowBetween,{alignItems:'center'}]}>
                <TouchableOpacity
                    onPress={handleDecrease}
                    style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 5,
                    marginRight: 5,
                    height:30,
                    width:30,
                    alignItems:'center'
                    }}
                >
                    <Text style={{ fontSize:20, color: COLORS.white, fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
                <TextInput
                    value={String(qty)}
                    style={{
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    width: 50,
                    textAlign: 'center',
                    borderRadius: 5,
                    }}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                    const value = parseInt(text, 10);
                    if (!isNaN(value) && value >= 0) {
                        setQty(value);
                    }
                    }}
                />
                <TouchableOpacity
                    onPress={handleIncrease}
                    style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 5,
                        marginRight: 5,
                        height:30,
                        width:30,
                        alignItems:'center',
                        marginLeft: 5,
                    }}
                >
                    <Text style={{ fontSize:20, color: COLORS.white, fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent:'center'}}>
                <TouchableOpacity onPress={() => onPress(item.id,qty)}>
                    <View style={{marginLeft:10,height:45, width:45, backgroundColor:COLORS.primary2, borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                        <Icon name="add-shopping-cart" size={22} color={COLORS.white} />
                    </View>
                </TouchableOpacity>

                
            </View>
        </View>
        
      </View>
    </View>
  );
};

export default ProductItem;
