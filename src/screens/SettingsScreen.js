import React, { useContext } from 'react';
import { View, Text, Button, TouchableOpacity,StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { logout, isAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigation.navigate('Login'); // Navigate to the login screen
    } else {
      alert('Logout failed. Please try again.');f
    }
  };

  return (
    <View style={styles.container}>
      
      {isAuthenticated && (
        <TouchableOpacity style={styles.button}
       
        onPress={handleLogout}        
        
      ><Text style={{color: 'white'}}>Log Out</Text></TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    marginTop: 20,          
    paddingHorizontal: 20,   
    paddingVertical: 10,  
    width: 150,   
    borderRadius: 20,        
    borderWidth: 1,          
    borderColor: 'red',     
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',          
  },
});

export default SettingsScreen;
