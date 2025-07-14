import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/Home';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export type BottomTabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const { totalQuantity } = useSelector((state: RootState) => state.carts);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00b894',
        tabBarInactiveTintColor: '#333',
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Feather name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: () => (
            <Feather name="shopping-cart" size={24} color="black" />
          ),
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color="black" />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;