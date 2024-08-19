import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Button,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color } from '@rneui/base';

const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [contactno, setContactNo] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [race, setRace] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [genderOpen, setGenderOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [raceOpen, setRaceOpen] = useState(false);

  const totalSteps = 3;


  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Non-Binary', value: 'Non-Binary' },
  ];

  const officialLanguagesInSA = [
    { label: 'Afrikaans', value: 'Afrikaans' },
    { label: 'English', value: 'English' },
    { label: 'IsiZulu', value: 'IsiZulu' },
    { label: 'Setswana', value: 'Setswana' },
    { label: 'Siswati', value: 'Siswati' },
  ];

  const raceOptions = [
    { label: 'African', value: 'African' },
    { label: 'White', value: 'White' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Other', value: 'Other' },
  ];

  const toggleDatepicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDatePickerChange = ({ type }, selectedDate) => {
    if (type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setDob(currentDate.toDateString());
      toggleDatepicker();
    } else {
      toggleDatepicker();
    }
  };

  const { register } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && !fullname) {
        Alert.alert('Error', 'Please enter your full name.');
        return;
      }
  
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleRegister = async () => {
    // Validate user inputs for each step before submitting the registration
    if (currentStep === 1) {
      if (!fullname) {
        Alert.alert('Error', 'Please enter your full name.');
        return;
      }
    } else if (currentStep === 2) {
      if (!email || !password || !dob || !gender) {
        Alert.alert('Error', 'Please fill in all the fields.');
        return;
      }
      if (!isEmailValid) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
      }
    } else if (currentStep === 3) {
      if (!contactno || !language || !location || !race) {
        Alert.alert('Error', 'Please fill in all the fields.');
        return;
      }
    }

    if (currentStep === totalSteps) {
      // Submit the registration data to the server
      try {
        setIsLoading(true);
        const userData = {
          fullname,
          email,
          password,
          dob,
          gender,
          contactno,
          language,
          location,
          race,
        };

        const response = await axios.post(`https://sittrapi-production.up.railway.app/api/v1/users/register`, userData);
        setIsLoading(false);

        // Show an alert indicating successful registration
        Alert.alert('Success', 'User registration was successful!');
        navigation.navigate('Login');
      } catch (error) {
        setIsLoading(false);
        console.error('Error:', error);
        Alert.alert('Error', 'User registration failed. Please try again.');
      }
    } else {
      handleNextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullname}
              onChangeText={setFullname}
            />
            <Button title="Next" style={styles.btnStyle} onPress={handleNextStep} />
          </View>
        );

      case 2:
        return (
          <View>
            <TextInput
              style={[styles.input, !isEmailValid && styles.invalidInput]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View>
              <Text style={{color: 'grey'}}>Date Of Birth</Text>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onDatePickerChange}
                />
              )}
              {!showDatePicker && (
                <Pressable onPress={toggleDatepicker}>
                  <TextInput
                    style={styles.input}
                    placeholder="Sat Aug 21 1996"
                    placeholderTextColor="#999"
                    value={dob}
                    editable={false}
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                items={genderOptions}
                placeholder="Select Gender"
                placeholderTextColor="#999"
                defaultValue={gender}
                open={genderOpen}
                setOpen={setGenderOpen}
                value={gender}
                setValue={setGender}
                containerStyle={{ height: 40, width: '100%' }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                dropDownDirection="TOP"
              />
            </View>
            <Button title="Previous" style={styles.btnStyle}  onPress={handlePreviousStep} />
            <Button title="Next" style={styles.btnStyle}  onPress={handleRegister} />
          </View>
        );

      case 3:
        return (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              placeholderTextColor="#999"
              value={contactno}
              onChangeText={setContactNo}
            />
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                items={officialLanguagesInSA}
                placeholder="Select Language"
                placeholderTextColor="#999"
                defaultValue={language}
                open={languageOpen}
                setOpen={setLanguageOpen}
                value={language}
                setValue={setLanguage}
                containerStyle={{ height: 40, width: '100%' }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                dropDownDirection="TOP"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                items={raceOptions}
                placeholder="Select Race"
                placeholderTextColor="#999"
                defaultValue={race}
                open={raceOpen}
                setOpen={setRaceOpen}
                value={race}
                setValue={setRace}
                containerStyle={{ height: 40, width: '100%' }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />
            </View>
            <Button title="Previous" style={styles.btnStyle}  onPress={handlePreviousStep} />
            <Button title="Register" style={styles.btnStyle}  onPress={handleRegister} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create An Account</Text>
      <Spinner visible={isLoading} />
      <SafeAreaView style={styles.wrapper}>{renderStep()}</SafeAreaView>
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
    borderRadius: 5,
    paddingHorizontal: 14,
    color: 'black'
  },
  invalidInput: {
    borderColor: 'red',
  },
  link: {
    color: 'blue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'grey'
  },
  dropDownContainer: {
    height: 40,
    marginBottom: 12,
  },
  btnStyle:{
    borderRadius: 20,
    marginTop: 20,
  }
});

export default RegisterScreen;
