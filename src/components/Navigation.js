import React, { useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TypeOfUserScreen from '../screens/TypeOfUserScreen';
import DisplayCaregivers from '../screens/DisplayCaregivers';
import BookingRequests from '../screens/BookingRequests';
import RegisterScreen from '../screens/RegisterScreen';
import CaregiverProfile from '../screens/CaregiverProfile';
import CaregiverRegisterScreen from '../screens/CaregiverRegisterScreen';
import MainNavigator from './MainNavigator';
import CaregiverMainNavigator from './CaregiverMainNavigator';

import Icon from 'react-native-vector-icons/FontAwesome';
const LogoHeader = () => {

  return( 
  
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',
       marginRight: 100
    }}>
    <Image
      source={require('../img/logo.png')}
      style={{ width: 50, height: 50 }}
      resizeMode="contain" // Adjust the resizeMode as needed
    />
  </View>
  );
};
const BackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Icon name="chevron-left" style={{
      marginRight: 10
    }} size={24} color="black" />
  </TouchableOpacity>
);

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>

      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DisplayCaregivers" component={DisplayCaregivers} options={{ headerShown: false}} />
        <Stack.Screen name="BookingRequests" component={BookingRequests} options={{ headerShown: false}} />
        <Stack.Screen name="CaregiverProfile" component={CaregiverProfile} options={({ navigation }) => ({
          title: '',
          headerTitle: LogoHeader,
          
        })} />
        <Stack.Screen name="Register" component={RegisterScreen} options={({ navigation }) => ({
          title: '',
          headerLeft: () => <BackButton navigation={navigation} />,
        })} />
        <Stack.Screen name="CaregiverRegister" component={CaregiverRegisterScreen} options={({ navigation }) => ({
          title: '',
          headerLeft: () => <BackButton navigation={navigation} />,
        })} />

        <Stack.Screen name="TypeOfUserScreen" component={TypeOfUserScreen} options={({ navigation }) => ({
          title: '',
          headerLeft: () => <BackButton navigation={navigation} />,
        })} />
       
          <Stack.Screen
            name="MainNavigator"
            component={MainNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CaregiverMainNavigator"
            component={CaregiverMainNavigator}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
