// MainNavigator.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DisplayCaregivers from '../screens/DisplayCaregivers';
import BookingHistory from "../screens/BookingHistory";
import SettingsScreen from '../screens/SettingsScreen';
import { useRoute } from '@react-navigation/native';
import DisplayAdvertisedCaregivers from "../screens/DisplayAdvertisedCaregivers";
import Messager from "../screens/Messager";
const Tab = createBottomTabNavigator();


const LogoHeader = () => {

  return( 
  
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',
       marginLeft: 140
    }}>
    <Image
      source={require('../img/logo.png')}
      style={{ width: 80, height: 80 }}
      resizeMode="contain" // Adjust the resizeMode as needed
    />
  </View>
  );
};

const MainNavigator = () => {
  const route = useRoute();
  const { userEmail } = route.params || {};
  console.log(userEmail);
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#E57C23' 
    }}
    
    >

      <Tab.Screen
        name="DisplayCaregivers"
        component={DisplayCaregivers}
        options={{
         title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerTitle: LogoHeader,
        }}
      
        initialParams={{ userEmail: userEmail }}
      />
      <Tab.Screen
        name="DisplayAdvertisedCaregivers"
        component={DisplayAdvertisedCaregivers}
        options={{
         title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="ad" color={color} size={size} />
          ),
          headerTitle: LogoHeader,
        }}
      
        initialParams={{ userEmail: userEmail }}
      />
      <Tab.Screen
        name="BookingHistory"
        component={BookingHistory}
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" color={color} size={size} />
          ),
          headerTitle: LogoHeader,
        }}

        
        initialParams={{ userEmail: userEmail }}
      />
      <Tab.Screen
        name="Messager"
        component={Messager}
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sms" color={color} size={size} />
          ),
          headerTitle: LogoHeader,
        }}

        
        initialParams={{ userEmail: userEmail }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
    
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
          headerTitle: LogoHeader,
        }}
      />
 
    </Tab.Navigator>
  );
};


export default MainNavigator;
