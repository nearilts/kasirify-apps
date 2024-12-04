import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import COLORS from '../const/color';
import { AuthContext } from '../context/AuthContext';
import BottomNavigation from './BottomNavigation';
import HomeScreen from '../ui/Home/HomeScreen';
import SidebarNavigation from './SidebarNavigation';
import HomeDetail from '../ui/Home/HomeDetail';
import LoginScreen from '../ui/Auth/LoginScreen';
import RegisterScreen from '../ui/Auth/RegisterScreen';
import ListToko from '../ui/Toko/ListToko';
const Stack = createNativeStackNavigator();

const Navigation = () => {

    const {userInfo,TokoInfo} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Stack.Navigator screenOptions={{headerShown: false}}>


      {userInfo.access_token  ? (
         TokoInfo.id  ? (
            <Stack.Screen name="LoginScreen" component={SidebarNavigation}/>
          ) :
          (
            <Stack.Screen name="LoginScreen" component={ListToko}/>
          )
        
        ) :
        (
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        )
      }
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

      <Stack.Screen name="SidebarNavigation" component={SidebarNavigation} />
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HomeDetail" component={HomeDetail} />
      <Stack.Screen name="ListTabScreen" component={HomeScreen} />
      <Stack.Screen name="AddTabScreen" component={HomeScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation