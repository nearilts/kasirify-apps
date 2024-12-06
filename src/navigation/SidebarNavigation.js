import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../const/color'
import HomeScreen from '../ui/Home/HomeScreen'
import ListCategory from '../ui/Master/Category/ListCategory';
import ListProduct from '../ui/Master/Product/ListProduct';
import ListKasir from '../ui/Master/Kasir/ListCategory';
import ListPelanggan from '../ui/Master/Pelanggan/ListPelanggan';
import TransaksiScreen from '../ui/Pos/Penjualan/TransaksiScreen';

const Drawer = createDrawerNavigator();

const SidebarNavigation = () => {
  return (
    <Drawer.Navigator
   
    screenOptions={({ route }) => ({
     drawerIcon: ({ focused, color, size }) => {
       let iconName;
       if (route.name === "Home Screen") {
         iconName = "home";
       } else if (route.name === "Category Product") {
         iconName = "person";
       } else if (route.name === "Product") {
         iconName = "person";
       } else if (route.name === "Kasir") {
        iconName = "person";
      }else if (route.name === "Pelanggan") {
        iconName = "person";
      }else if (route.name === "Transaksi") {
        iconName = "person";
      }

       return <Icon name={iconName} size={size} color={color} />;
     },
     tabBarActiveTintColor: 'blue',
     tabBarInactiveTintColor: 'gray',
   })}>
     <Drawer.Screen name="Home Screen" component={HomeScreen} />
     <Drawer.Screen name="Category Product" component={ListCategory} />
     <Drawer.Screen name="Product" component={ListProduct} />
     <Drawer.Screen name="Kasir" component={ListKasir} />
     <Drawer.Screen name="Pelanggan" component={ListPelanggan} />
     <Drawer.Screen name="Transaksi" component={TransaksiScreen} />

   </Drawer.Navigator>

  )
}

export default SidebarNavigation