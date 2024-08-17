import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password, navigation) => {
    setIsLoading(true);
  
    try {
      // Use the Railway URL directly
      const url = 'https://sittrapi-production.up.railway.app/api/v1/allusers/login';
      const loginData = { email, password };
  
      const response = await axios.post(url, loginData);
  
      const userData = response.data.user;
      setUserInfo(userData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      setIsLoading(false);
      setIsAuthenticated(true);
  
      if (userData.usertype === 'parent') {
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
      alert('Incorrect email or password. Please try again.');
    } else if (error.response && error.response.status === 404) {
      alert('User or caregiver not found. Please register first.');
    } else {
      alert('An error occurred during login. Please try again later.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo({});
      setIsAuthenticated(false);
      return true; 
    } catch (error) {
      console.log(`logout error ${error}`);
      return false; 
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
