//CaregiverMainNavigator.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CaregiverHomeScreen from '../screens/CaregiverHomeScreen';
import BookingRequests from '../screens/BookingRequests';
import SettingsScreen from '../screens/SettingsScreen';
import JobInProgress from '../screens/JobInProgress';
import ProfileScreenCaregiver from '../screens/ProfileScreenCaregiver';
import MessagerCaregiver from '../screens/MessagerCaregiver';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();


const LogoHeader = () => {

  return( 
  
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',
       marginLeft: 140
    }}>
    <Image
      source={require('../img/logo.png')}
      style={{ width: 70, height: 70 }}
      resizeMode="contain" // Adjust the resizeMode as needed
    />
  </View>
  );
};

const  CaregiverMainNavigator = () => {
  const route = useRoute();
  const { caregiverEmail } = route.params || {};
  console.log(caregiverEmail);
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#E57C23' 
    }}
    >

      <Tab.Screen
        name="BookingRequests"
        component={BookingRequests}
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" color={color} size={size} />
          ),
          headerTitle: LogoHeader
        }}
        initialParams={{ caregiverEmail: caregiverEmail }}
      />
      <Tab.Screen
        name="JobInProgress"
        component={JobInProgress}
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="baby-carriage" color={color} size={size} />
          ),
          headerTitle: LogoHeader
        }}
        initialParams={{ caregiverEmail: caregiverEmail }}
      />
        <Tab.Screen
        name="Messager"
        component={MessagerCaregiver}
    
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sms" color={color} size={size} />
          ),
          headerTitle: LogoHeader
        }}
        initialParams={{ caregiverEmail: caregiverEmail }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreenCaregiver}
    
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-circle" color={color} size={size} />
          ),
          headerTitle: LogoHeader
        }}
        initialParams={{ caregiverEmail: caregiverEmail }}
      />
    
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
    
        options={{
            title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
          headerTitle: LogoHeader
        }}
        initialParams={{ caregiverEmail: caregiverEmail }}
      />
 
    </Tab.Navigator>
  );
};

export default CaregiverMainNavigator;
