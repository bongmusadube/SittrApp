import React from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoffButton = ({ navigation }) => {
  const handleLogoff = async () => {
    try {
      // Clear the authentication token from AsyncStorage upon logoff
      await AsyncStorage.removeItem('authToken');
      // Navigate the user back to the login screen
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Error logging off:', error);
    }
  };

  return (
    <View>
      <Button title="Log Off" onPress={handleLogoff} />
    </View>
  );
};

export default LogoffButton;
