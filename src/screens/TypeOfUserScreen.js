import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TypeOfUserScreen = ({ navigation }) => {
  const handleRegisterAsParent = () => {
    navigation.navigate('Register'); // Navigate to the RegisterScreen
  };

  const handleRegisterAsCaregiver = () => {
    navigation.navigate('CaregiverRegister'); // Navigate to the CaregiverRegisterScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Sittr!</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRegisterAsParent}>
        <Text style={styles.buttonText}>Register As User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRegisterAsCaregiver}>
        <Text style={styles.buttonText}>Register As Caregiver</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Helvetica Neue', // Use the same font as Apple.com
  },
  buttonContainer: {
    marginTop: 15,
    width: '70%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#E57C23',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Helvetica Neue', // Use the same font as Apple.com
  },
});

export default TypeOfUserScreen;
