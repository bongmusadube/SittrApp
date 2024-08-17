import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform, Pressable, SafeAreaView, FlatList, ScrollView} from 'react-native';
import axios from 'axios';
import { ipConfig } from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import UploadDocumentComponent from '../components/UploadDocumentsComponent';
import { create } from 'react-test-renderer';
import ImagePicker from 'react-native-image-picker';

const CaregiverRegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idDocument, setIdDocument] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [idDocumentName, setIdDocumentName] = useState('');
  const [policeClearanceName, setPoliceClearanceName] = useState('');
  const [profilePictureName, setProfilePictureName] = useState('');
  
  const [policeClearance, setPoliceClearance] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [workingDays, setWorkingDays] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [raceOpen, setRaceOpen] = useState(false);


  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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

      // Minimum and maximum time values
      const minTime = new Date();
      minTime.setHours(6, 0, 0, 0);
      const maxTime = new Date();
      maxTime.setHours(22, 0, 0, 0);

  
  const toggleWorkingDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays((prevDays) => prevDays.filter((d) => d !== day));
    } else {
      setWorkingDays((prevDays) => [...prevDays, day]);
    }
  };
 
  const handleStartTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      setStartTime(selectedTime);
      // Ensure end time is not less than start time
      if (selectedTime > endTime) {
        setEndTime(selectedTime);
      }
    }
    setStartTimePickerVisible(false);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    if (event.type === 'set' && selectedTime >= startTime) {
      setEndTime(selectedTime);
    } else if (selectedTime < startTime) {
      // Show alert if end time is less than start time
      Alert.alert("Invalid Time", "End time cannot be less than start time.");
    }
    setEndTimePickerVisible(false);
  };

  const toggleStartTimePicker = () => {
    setShowStartTimePicker((prev) => !prev);
  };

  const toggleEndTimePicker = () => {
    setShowEndTimePicker((prev) => !prev);
  };

  useEffect(() => {
    // When the working days screen is opened, reset the time picker visibility
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  }, [currentStep]);



  const toggleDatepicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDatePickerChange = ({ type }, selectedDate) => {
    if (type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setDateOfBirth(currentDate.toDateString());
      toggleDatepicker();
    } else {
      toggleDatepicker();
    }
  };

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
  const handleImagePicker = async (fieldName) => {
    try {
      console.log('Attempting to pick image...');
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
     console.log(results);
     console.log(results[0].uri);
      if (results[0].uri) {
        const result = results[0];
        switch (fieldName) {
          case 'idDocument':
            setIdDocument(result);
            setIdDocumentName(result.name); // Update selected file name
            console.log('Image picked:', result);
            console.log('Result URI:', result.uri);
            console.log('Result Name:', result.name);
            break;
          case 'policeClearance':
            setPoliceClearance(result);
            setPoliceClearanceName(result.name); // Update selected file name
            console.log('Image picked:', result);
            console.log('Result URI:', result.uri);
            console.log('Result Name:', result.name);
            break;
          case 'profilePicture':
            setProfilePicture(result);
            setProfilePictureName(result.name); // Update selected file name
            console.log('Image picked:', result);
            console.log('Result URI:', result.uri);
            console.log('Result Name:', result.name);
            break;
        }
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };
  

  const uploadImage = async (fieldName, imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      name: 'image.jpg', // Provide a name for the uploaded file
      type: 'image/jpeg', // Adjust the image type as needed
      uri: imageUri,
    });
  
    try {
      const response = await axios.post(`http://${ipConfig}:8080/api/v1/allusers/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
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
      if (!email || !password || !dateOfBirth || !gender) {
        Alert.alert('Error', 'Please fill in all the fields.');
        return;
      }

      if (!isEmailValid) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
      }
    } else if (currentStep === 3) {
      if (!contactNumber || !language || !location || !hourlyRate || !yearsOfExperience) {
        Alert.alert('Error', 'Please fill in all the fields.');
        return;
      }
    } else if (currentStep === 4) {
      if (!workingDays.length || !startTime || !endTime) {
        Alert.alert('Error', 'Please select working days, start time, and end time.');
        return;
      }
  
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      
      if (end <= start) {
        Alert.alert('Error', 'End time cannot be less than or equal to start time.');
        return;
      }
  
    } else if (currentStep === 5) {
      // Check if ID and police clearance images are uploaded
      if (!idDocument || !policeClearance) {
        Alert.alert('Error', 'Please upload both ID and police clearance documents.');
        return;
      }
    }

    if (currentStep <  totalSteps) {
          handleNextStep();
    } else {
      
      try {

        const idImageUrl = await uploadImage('idDocument', idDocument.uri);
        const idImageFileName = idImageUrl.split('/').pop(); 
      

        const policeClearanceImageUrl = await uploadImage('policeClearance', policeClearance.uri);
        const policeClearanceFileName = policeClearanceImageUrl.split('/').pop(); 
  
        const profilePictureImageUrl = await uploadImage('profilePicture', profilePicture.uri);
        const profilePictureFileName = profilePictureImageUrl.split('/').pop();
  
    
   

      const yearsOfExperienceInt = isNaN(yearsOfExperience) ? 0 : parseInt(yearsOfExperience);

      const caregiverData = {
        fullname,
        email,
        password,
        date_of_birth: dateOfBirth,
        gender,
        contact_number: contactNumber,
        language,
        location,
        hourly_rate: hourlyRate,
        years_of_experience: yearsOfExperienceInt,
        id_url: idImageFileName,
        police_clearance_url: policeClearanceFileName,
        profile_picture_url: profilePictureFileName,
      };

 
       const response = await axios.post(`http://${ipConfig}:8080/api/v1/caregivers/register`, caregiverData, {

       headers: {
        'Content-Type': 'application/json',
      },

       });
           // Handle the response from the server if needed
      console.log(response.data);
      // Show an alert indicating successful registration
      Alert.alert('Success', 'Caregiver registration was successful!');
      navigation.navigate('Login');
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error:', error);
      // Show an alert indicating registration failed
      Alert.alert('Error', 'Caregiver registration failed. Please try again.');
    
    }

  
  }      
    } 
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
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
          <View style={styles.stepContainer}>
            <TextInput
              style={[styles.input, !isEmailValid && styles.invalidInput]}
              placeholder="Email"
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View>
              <Text>Date Of Birth</Text>
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
                    value={dateOfBirth}
                    placeholderTextColor="grey"
                    editable={false}
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                items={genderOptions}
                placeholder="Select Gender"
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
            <Button title="Previous" style={styles.btnStyle} onPress={handlePreviousStep} />
            <Button title="Next" style={styles.btnStyle} onPress={handleNextStep} />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
                            <View style={styles.dropDownContainer}>
              <DropDownPicker
                items={officialLanguagesInSA}
                placeholder="Select Language"
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
                dropDownDirection="BOTTOM"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={styles.input}
              placeholder="Preferred Hourly Rate"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              keyboardType="numeric"
            />
            <Button title="Previous" style={styles.btnStyle} onPress={handlePreviousStep} />
            <Button title="Next" style={styles.btnStyle} onPress={handleNextStep} />
          </View>
        );
        case 4:
          return (
            <View style={styles.stepContainer}>
              
              
              <View style={styles.workingDaysContainer}>
                <Text style={styles.label}>Working Days:</Text>
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        workingDays.includes(day) ? styles.activeDay : styles.inactiveDay,
                      ]}
                      onPress={() => toggleWorkingDay(day)}
                    >
                      <Text style={styles.dayButtonText}>{day.charAt(0)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerLabel}>Start Time:</Text>
              <TouchableOpacity
                onPress={() => setStartTimePickerVisible(true)}
                style={styles.timePickerInput}
              >
                <Text style={styles.timePickerText}>
                  {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                </TouchableOpacity>
      {isStartTimePickerVisible && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          minimumDate={minTime}
          maximumDate={maxTime}
          minuteInterval={15}
          onChange={handleStartTimeChange}
        />
      )}
            </View>
            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerLabel}>End Time:</Text>
              <TouchableOpacity
                onPress={() => setEndTimePickerVisible(true)}
                style={styles.timePickerInput}
              >
                <Text style={styles.timePickerText}>
                  {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                </TouchableOpacity>
      {isEndTimePickerVisible && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          minimumDate={startTime}
          maximumDate={maxTime}
          minuteInterval={15}
          onChange={handleEndTimeChange}
        />
      )}
            </View>
            
              <Button title="Previous" style={styles.btnStyle} onPress={handlePreviousStep} />
            <Button title="Next" style={styles.btnStyle} onPress={handleNextStep} />
            </View>
            
          );

      case 5:
        return (
          <View style={styles.stepContainer}>
<Text style={styles.label}>ID Number:</Text>
<TextInput
  style={styles.input}
  placeholder="Enter ID Number"
  value={idNumber}
  onChangeText={setIdNumber}
  keyboardType="numeric"
/>

<View style={styles.uploadContainer}>
  <Text>Upload ID:</Text>
  <Button title={`Select ID Image (${idDocumentName || 'No file selected'})`} onPress={() => handleImagePicker('idDocument')} />
</View>

<View style={styles.uploadContainer}>
  <Text>Upload Police Clearance Image:</Text>
  <Button title={`Select Police Clearance Image (${policeClearanceName || 'No file selected'})`} onPress={() => handleImagePicker('policeClearance')} />
</View>

<View style={styles.uploadContainer}>
  <Text>Upload Profile Picture:</Text>
  <Button title={`Select Profile Picture (${profilePictureName || 'No file selected'})`} onPress={() => handleImagePicker('profilePicture')} />
</View>




            
            <Button title="Previous" style={styles.btnStyle} onPress={handlePreviousStep} />
            <Button title="Register" style={styles.btnStyle} onPress={handleRegister} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Caregiver Registration</Text>
      {renderStep()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
   
  },
  wrapper: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  stepContainer: {
    flex: 1,
    
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropDownContainer: {
    height: 40,
    marginBottom: 10,
    zIndex: 1,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  dropDownItem: {
    justifyContent: 'flex-start',
  },
  uploadContainer: {
    marginBottom: 20,
  },
  btnStyle: {
    borderRadius: 20,
    marginTop: 20,
  },
  invalidInput: {
    borderColor: 'red',
  },
  workingDaysContainer: {
    marginBottom: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeDay: {
    backgroundColor: '#5cb85c', // Green color for active day
  },
  inactiveDay: {
    backgroundColor: '#fff',
  },
  dayButtonText: {
    color: '#000',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePicker: {
    flex: 1,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF', // Example button background color
    borderRadius: 20,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-end', // Align to the right
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CaregiverRegisterScreen;