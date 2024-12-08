import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../const/color';
import ButtonCircle from './ButtonCircle';


const ButtomIcon = () => {
    const navigation = useNavigation();


    const buttonData = [
        { id: '1', iconName: 'list', color: COLORS.pink, label:'Kategori',onclick: 'Category Product' },
        { id: '2', iconName: 'store', color: COLORS.darkGreen, label:'Product',onclick: 'Product' },
        { id: '3', iconName: 'countertops', color: COLORS.red, label:'Kasir',onclick: 'Kasir' },
        { id: '4', iconName: 'face', color: COLORS.orange, label:'Pelanggan',onclick: 'Pelanggan' },
        { id: '5', iconName: 'shopping-cart', color: COLORS.navy, label:'POS',onclick: 'Transaksi' },
        { id: '6', iconName: 'point-of-sale', color: COLORS.darkBlue, label:'PPOB',onclick: 'VoucherPpob' },
        { id: '7', iconName: 'account-balance-wallet', color: COLORS.green, label:'Top Up ',onclick: 'Ticket' },
        { id: '8', iconName: 'login', color: COLORS.bronze, label:'Tarik Saldo',onclick: 'SemuaPpob' },
    ];
    
        const renderItem = ({ item }) => (
            <ButtonCircle
                iconName={item.iconName} 
                color={item.color} 
                onPress={() => navigation.navigate(item.onclick)} 
                label={item.label} 
            />
        );



    return (
        <View style={{alignItems:'center'}} >
            <FlatList
            data={buttonData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={4}
            columnWrapperStyle={styles.row} // Add style to space items
        />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between', // Distribute buttons evenly
    },
});

export default ButtomIcon;
