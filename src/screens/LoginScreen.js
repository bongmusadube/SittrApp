import React, { useContext, useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import axios from 'axios'; // Import axios library for making API requests
import { AuthContext } from '../context/AuthContext';
import { ipConfig } from '../config';
import Header from '../components/header';
import { CommonActions } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome5";  
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { isLoading, login } = useContext(AuthContext);
  const [userType, setUserType] = useState(null); // Use state to track user/caregiver login

  const handleUserLogin = () => {
    login(email, password, navigation);
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



  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center',
    }}>
    <Image
      source={require('../img/logo.png')}
      style={{ width: 300, height: 300 }}
      resizeMode="contain" // Adjust the resizeMode as needed
    />
  </View>
      <Header title={'Welcome Back!👋'} />

      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter email"
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

     <TouchableOpacity
        onPress={handleUserLogin}
        disabled={isLoading}
        style={styles.buttonStyle}
      ><Text style={{
        textAlign: 'center',
        color: 'white'
      }}>Login</Text></TouchableOpacity>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('TypeOfUserScreen')}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
         
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 20,
    paddingHorizontal: 14,
  },
  link: {
    color: 'blue',
  },
  selectedLink: {
    color: 'red', 
    fontWeight: 'bold', 
  },
  buttonStyle: {
    backgroundColor: '#E57C23',
    borderRadius: 20,
    padding: 10,
    color: 'white'
  }

});

export default LoginScreen;
