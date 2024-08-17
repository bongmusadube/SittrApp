import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { ipConfig } from '../config';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password, navigation) => {
    setIsLoading(true);
  
    try {
      const url = `http://${ipConfig}:8080/api/v1/allusers/login`;
      const loginData = { email, password };
  
      const response = await axios.post(url, loginData);
  
      const userData = response.data.user;
      setUserInfo(userData);
      AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      setIsLoading(false);
      setIsAuthenticated(true);
  
      if (userData.usertype === 'parent') {
        // You might need to adjust the navigation part based on your navigation setup
        // This example assumes that you are navigating to 'MainNavigator'
        navigation.navigate('MainNavigator', { userEmail: email });
      } else if (userData.usertype === 'caregiver') {
        navigation.navigate('CaregiverMainNavigator', { caregiverEmail: email });
      }
  
    
    } catch (error) {
      console.log(`login error ${error}`);
      setIsLoading(false);
      alert('Login failed. Please check your credentials.');
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.response && error.response.status === 401) {
      // If the response status is 401 (Unauthorized), the password is incorrect
      alert('Incorrect email or password. Please try again.');
    } else if (error.response && error.response.status === 404) {
      // If the response status is 404 (Not Found), the user or caregiver is not found
      alert('User or caregiver not found. Please register first.');
    } else {
      // For other errors, show a generic error message
      alert('An error occurred during login. Please try again later.');
    }
  };

  // const logout = async (navigation) => {
  //   try {
  //     await AsyncStorage.removeItem('userInfo');
  //     setUserInfo({});
  //     setIsAuthenticated(false);
  //     alert('Logged out successfully!');
  //     navigation.navigate('LoginScreen'); // Navigate to the login screen
  //   } catch (error) {
  //     console.log(`logout error ${error}`);
  //   }
  // };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo({});
      setIsAuthenticated(false);
      return true; // Return true for successful logout
    } catch (error) {
      console.log(`logout error ${error}`);
      return false; // Return false for logout failure
    }
  };

  const isLoggedIn = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(`is logged in error ${error}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        userInfo,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
