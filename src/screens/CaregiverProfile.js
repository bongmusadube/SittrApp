import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Pressable,Button, PermissionsAndroid, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { Rating } from 'react-native-stock-star-rating';
import { ipConfig } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import { merge } from 'lodash'; 
import { format } from 'date-fns';


const caregiverUrl = `http://${ipConfig}:8080/api/v1/caregivers`;
const imagesUrl = `http://${ipConfig}:8080/api/v1/allusers/images/`;
const CaregiverProfile = ({ route }) => {
  const { userEmail, caregiverEmail, caregiverProfileUrl } = route.params;
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  console.log(userEmail, caregiverEmail, caregiverProfileUrl);

  // State variables for form inputs
  const [bookingStartTime, setBookingStartTime] = useState("");
  const [bookingEndTime, setBookingEndTime] = useState("");
  const [numOfKids, setNumOfKids] = useState("");
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState(false);
  const [needsTransport, setNeedsTransport] = useState(false);
  const [comment, setComment] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [googlePlacesApiKey, setGooglePlacesApiKey] = useState('AIzaSyAlQIk1Nc4_zKvIltCZuy3jrJ-brsOVkgQ');
  const [getImage, setImage] = useState(require('../img/placeholder_img.png'));
  const [selectedDates, setSelectedDates] = useState({});
  const [bookingDate, setBookingDate] = useState(new Date()); 
  const [selectedBookingDate, setSelectedBookingDate] = useState(new Date());
  const [isBookingDateCalendarVisible, setBookingDateCalendarVisible] = useState(false);
  const [minSelectableDate, setMinSelectableDate] = useState(new Date());
  const [selectedDatesText, setSelectedDatesText] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [bookedDates, setBookedDates] = useState([]);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [caregiver, setCaregiver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);


    // Minimum and maximum time values
    const minTime = new Date();
    minTime.setHours(6, 0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(22, 0, 0, 0);

    useEffect(() => {
      // Fetch the caregiver's data based on the caregiverEmail
      axios.get(`http://${ipConfig}:8080/api/v1/caregivers/${caregiverEmail}`)
          .then(response => {
              setCaregiverInfo(response.data);
              setIsLoading(false);
          })
          .catch(error => {
              console.error('Error fetching caregiver:', error);
              setIsLoading(false);
          });
  
      // Fetch the review statistics for the caregiver
      axios.get(`http://${ipConfig}:8080/api/v1/caregivers/reviewstats/${caregiverEmail}`)
          .then(response => {
              const { total_ratings, average_rating } = response.data;
              setCaregiverInfo(prevCaregiverInfo => ({
                  ...prevCaregiverInfo,
                  total_ratings,
                  average_rating,
              }));
              setIsLoading(false);
          })
          .catch(error => {
              console.error('Error fetching caregiver review statistics:', error);
          });
          axios.get(`http://${ipConfig}:8080/api/v1/caregivers/booked-dates/${caregiverEmail}`)
          .then(response => {
            const { bookedDates } = response.data;
            setBookedDates(bookedDates);
          })
          .catch(error => {
            console.error('Error fetching caregiver booked dates:', error);
          });
          



  }, [caregiverEmail]);

  
  useEffect(() => {
    // Fetch caregiver's profile information
    axios
      .get(`${caregiverUrl}/${route.params.caregiverEmail}`)
      .then((response) => {
        setCaregiver(response.data);
      })
      .catch((error) => {
        console.error('Error fetching caregiver profile:', error);
      });

    // Fetch caregiver's recent reviews
    axios
      .get(`${caregiverUrl}/reviews/${route.params.caregiverEmail}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error('Error fetching caregiver reviews:', error);
      });

    axios
      .get(`${caregiverUrl}/reviewstats/${route.params.caregiverEmail}`)
      .then((response) => {
        setReviewStats(response.data);
      })
      .catch((error) => {
        console.error('Error fetching review stats:', error);
      });
  }, [route.params.caregiverEmail]);

  const openReviewModal = () => {
    setReviewModalVisible(true);
  };

  const closeReviewModal = () => {
    setReviewModalVisible(false);
  };
  

  if (isLoading) {
    // Render a loading spinner if data is still being fetched
    return <ActivityIndicator size="large" color="blue" />;
  }


  


  const getUserLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, fetch the user's location
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await getHomeAddressFromCoords(latitude, longitude);
          },
          (error) => {
            console.error(error);
            // Handle error cases
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getMarkedDates = () => {
    const combinedDates = merge(
      bookedDates.reduce((obj, date) => {
        obj[date] = { marked: true, dotColor: 'red' };
        return obj;
      }, {}),
      selectedDates
    );
    return combinedDates;
  };
  
 
  const handleDateSelection = (date) => {
    if (new Date(date.dateString) < minSelectableDate) {
      setMinSelectableDate(new Date(date.dateString));
    }

    if (bookedDates.includes(date.dateString)) {
      // Date is already booked, prevent selection and show alert
      setAlertVisible(true);
    } else {
      setSelectedDates((prevSelectedDates) => {
        const updatedDates = { ...prevSelectedDates };
        if (updatedDates[date.dateString]) {
          // Date is already selected, so remove it from the selection
          delete updatedDates[date.dateString];
        } else {
          // Date is not selected, so add it to the selection
          updatedDates[date.dateString] = { selected: true };
        }
        // Generate the selected dates string
        const selectedDateStrings = Object.keys(updatedDates).join(', ');
        setSelectedDatesText(selectedDateStrings);
        return updatedDates;
      });
    }
  };
  
  
  

  // Function to fetch the address based on coordinates using the Google Geocoding API
  const getHomeAddressFromCoords = async (latitude, longitude) => {
    try {
      const apiKey = 'AIzaSyAlQIk1Nc4_zKvIltCZuy3jrJ-brsOVkgQ'; // Replace with your actual Google API key
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      // Parse the response and extract the formatted address
      const formattedAddress = response.data.results[0].formatted_address;
      setUserAddress(formattedAddress); // Set the address in the state
    } catch (error) {
      console.error(error);
    }
  };
  
  const getHomeAddress = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, fetch the user's location
        const { latitude, longitude } = await Geolocation.getCurrentPosition();
  
        // Use the Google Maps Geocoding API to get the address
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
  
        // Set the address in the state
        setUserAddress(response.data.results[0].formatted_address);
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  



  
  const handlePlaceSelected = (place) => {
    setUserAddress(place.address);
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
  



  

  const handleBook = () => {
    const currentDate = new Date(); // Get the current date
    setStartTime(currentDate); // Set start time to current date
    setEndTime(currentDate); // Set end time to current date
    setBookingModalVisible(true); // Show the booking modal

    setBookingModalVisible(true); // Show the booking modal
  };
  

  const handleFormSubmit = () => {
    // Perform validation on form inputs if needed

    // Create a booking object with the form data
    const selectedDateStrings = Object.keys(selectedDates);
     console.log(selectedDates);
     // Format the start and end times
     const formattedStartTime = format(startTime, 'HH:mm');
     const formattedEndTime = format(endTime, 'HH:mm');

     //Calculate total_hours
     const timeDiff = endTime - startTime;
     const hours = timeDiff / (1000 * 60 * 60); // Convert milliseconds to hours
     const totalHours = hours * selectedDateStrings.length; // Multiply by the number of selected dates
   
     // Calculate total_amount
     const hourlyRate = caregiverInfo.hourly_rate || 0; // Default rate to 0 if null
     const totalAmount = hourlyRate * totalHours;

    const bookingData = {
      user_email: userEmail,
      caregiver_email: caregiverEmail,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      user_homeaddress: userAddress,
      total_hours: totalHours,
      total_amount: totalAmount,
      number_of_kids: numOfKids,
      special_needs: hasSpecialNeeds,
      transport_needs: needsTransport,
      comments: comment,
      selected_dates: selectedDateStrings, 
   

    };

    // Make a POST request to create a booking with the form data
    axios.post(`http://${ipConfig}:8080/api/v1/bookings`, bookingData)
      .then(response => {
        // Booking was successful
        Alert.alert('Booking Successful', `Booking created for ${caregiverInfo.fullname}`);
        setBookingModalVisible(false); // Hide the booking modal after successful booking

        // Reset the form fields after successful booking
        setBookingStartTime("");
        setBookingEndTime("");
        setNumOfKids("");
        setHasSpecialNeeds(false);
        setNeedsTransport(false);
        setComment("");
        setUserAddress("");
      })
      .catch(error => {
        // Booking failed
        console.error('Error creating booking:', error);
        Alert.alert('Booking Failed', 'Failed to create booking. Please try again later.');
      });
  };


  return (

    <View style={styles.cardStyle}>
      < Image style={styles.imgStyle} 
      
      source={ {uri: imagesUrl + caregiverProfileUrl}}
      onError={() => {
        // If the image fails to load, display the placeholder image
        setImage(require('../img/placeholder_img.png'));
      }}
      
      />


<View style={styles.overlayContent}>
    <View style={{...styles.overlayTop,
         alignItems: 'flex-start',
        
    }}>
  
      
      
      <Text style={styles.textStyle}>{caregiverInfo.fullname}</Text>
       <View
           style={{flexDirection: 'row',
                    alignItems: 'space-between',
                    marginVertical: 10
          }} 
       >
           <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}  onPress={openReviewModal}>
        <Rating
            stars={caregiverInfo.average_rating || 0} // Use the average rating, default to 0 if null
            maxStars={5}
            size={20}
            containerStyle={{ marginRight: 5 }}
        />
        <Text style={{ fontSize: 16 }}>
            ({caregiverInfo.total_ratings || 0})
        </Text>
    </TouchableOpacity>
        
        <Text
       style = {{
           padding: 5,
           borderRadius: 20,
           backgroundColor: '#E57C23',
           width: 120,
           color: 'white',
           marginLeft: 70,
           textAlign: 'center',

       }}
       >
         Has Transport
        
        </Text></View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
      }}>
        <Icon name="money-bill-wave" size={15} color="black" style={{
          marginRight: 16
        }}/>
        <Text 
        style={{...styles.priceStyle
          
        }}>R{caregiverInfo.hourly_rate}/h</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
      }}>
        <Icon name="map-pin" size={15} color="black" style={{
          marginRight: 26,
        }}/>
        <Text 
        style={{...styles.priceStyle
          
        }}>{caregiverInfo.location}</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
      }}>
        <Icon name="language" size={15} color="black" style={{
          marginRight: 16,
        }}/>
        <Text 
        style={{...styles.priceStyle
          
        }}>{caregiverInfo.language}, Zulu</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
      }}>
        <Icon name="baby-carriage" size={15} color="black" style={{
          marginRight: 18,
        }}/>
        <Text 
        style={{...styles.priceStyle
          
        }}>{caregiverInfo.years_of_experience} Years of Experence</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
      }}>
        <Icon name="baby" size={15} color="black" style={{
          marginRight: 20,
        }}/>
        <Text 
        style={{...styles.priceStyle
          
        }}>Can Care for Up to of 3 Kids</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
      }}>
        <Icon name="accessible-icon" size={15} color="black" style={{
          marginRight: 20,
        }}/>
        <Text 
        style={{...styles.priceStyle
          
        }}>Specializes in Special Needs Care</Text>
      </View>

      <Text style={{...styles.priceStyle,
                marginTop: 5,
                fontSize: 13
      }}>Short Bio</Text>
      <View style={{
              borderRadius: 20,
              borderWidth: 1, 
              borderColor: 'rgba(0, 0, 0, 0.2)',
              height: 50,
              width: 300,
              padding: 5,
              marginTop: 3
      }}>
      <Text style={styles.bioStyle}>I Love Kids💖</Text>
      </View>
    </View>
    
 
    <TouchableOpacity style={{...styles.buttonStyle, width: 200}} onPress={handleBook}>
      <Text style={styles.bookButtonText}>Book</Text>
    </TouchableOpacity>
  </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isBookingModalVisible}
        onRequestClose={() => {
          setBookingModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Pressable style={styles.closeButton} onPress={() => setBookingModalVisible(false)}>
      <Text style={styles.closeButtonText}> <Icon name="arrow-left" size={25} color="black"/></Text>
    </Pressable>
            <Text style={styles.modalTitle}>Booking Details</Text>
            <Text style={{ textAlign: 'center', marginVertical: 10, }}> 
        Please choose a time between 06:00 and 22:00.
      </Text>
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
              <Text style={{...styles.timePickerLabel,
                           
              }}>End Time:</Text>
              <TouchableOpacity
                onPress={() => setEndTimePickerVisible(true)}
                style={{...styles.timePickerInput,
                        marginLeft: 6,
                }}
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
            <TextInput
  style={styles.input}
  placeholder="Selected Dates"
  value={selectedDatesText}
  editable={false}
/>
            <TouchableOpacity
  style={styles.datePickerButton}
  onPress={() => setBookingDateCalendarVisible(true)}
>
  <Text style={styles.datePickerButtonText}>Select Booking Date</Text>
</TouchableOpacity>

  
    {isBookingDateCalendarVisible && (
       <Modal
       animationType="slide"
       transparent={true}
       visible={isBookingDateCalendarVisible}
       onRequestClose={() => {
         setBookingDateCalendarVisible(false);
       }}
     >
        <View style={styles.dateCalendarContainer}>
        <Calendar
         style={styles.calendar}
        current={selectedBookingDate.toISOString()}
        minDate={minSelectableDate.toISOString()}
        onDayPress={handleDateSelection}
        hideExtraDays
        markedDates={getMarkedDates()}
      />

{isAlertVisible && (
  Alert.alert(
    `${caregiverInfo.fullname} is booked on this date`,
    'Please choose a different date.',
    [
      {
        text: 'OK',
        onPress: () => setAlertVisible(false),
      },
    ]
  )
)}

<TouchableOpacity
        style={styles.closeCalendarButton}
        onPress={() => setBookingDateCalendarVisible(false)}
      >
        <Text style={styles.closeCalendarButtonText}>Close Calendar</Text>
      </TouchableOpacity>
        </View>
      </Modal>
    )}
            
            <TextInput
              style={styles.input}
              placeholder="Number of Kids"
              value={numOfKids}
              onChangeText={text => setNumOfKids(text)}
              keyboardType="numeric"
            />
            <View style={styles.checkboxContainer}>
           
              <CheckBox
              style={styles.roundCheckbox}

                value={hasSpecialNeeds}
                onValueChange={setHasSpecialNeeds}
                tintColors={{ true: '#E57C23', false: 'gray' }}
             
              />
             
              <Text style={styles.checkboxLabel}>Special Needs Kids</Text>
            </View>
            {hasSpecialNeeds && (
              <TextInput
                style={styles.input}
                placeholder="Comments for Special Needs"
                value={comment}
                onChangeText={text => setComment(text)}
              />
            )}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={needsTransport}
                onValueChange={setNeedsTransport}
                tintColors={{ true: '#E57C23', false: 'gray' }}
             
              />
              <Text style={styles.checkboxLabel}>Transport Needed</Text>
            </View>
           
            <View>
  <TextInput
    placeholder="Home Address"
    value={userAddress}
    onChangeText={(text) => setUserAddress(text)}
  />
  <TouchableOpacity
    style={styles.googlePlacesContainer}
    onPress={getUserLocation}
  >
    <Text>Use Current Location</Text>
  </TouchableOpacity>
</View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleFormSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={closeReviewModal}
      >
        <View style={styles.reviewModalContainer}>
          <View style={styles.reviewModalContent}>
            <Text style={styles.reviewModalTitle}>{caregiverInfo.fullname} Reviews</Text>
            {reviews.map((review, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#E5E5E5',
                  padding: 15,
                  margin: 10,
                  borderRadius: 10,
                }}
              >
                <Text>
                  <Rating stars={review.caregiver_rating} maxStars={5} size={16} />
                  {'  '}
                  By {review.user_email} on {review.created_at}
                </Text>
                <Text>{review.review_comment}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.closeReviewModalButton}
              onPress={closeReviewModal}
            >
              <Text style={styles.closeReviewModalButtonText}>Close Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    alignItems: 'center',
    height: '100%',
    borderRadius: 30,
    backgroundColor: 'white',
   
  },
  imgStyle: {
    height: 400,
    width: 400,
    borderRadius: 30,
    alignSelf: 'center',
  },
  bookButton: {
    backgroundColor: 'blue',
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#393E46',
    flexWrap:"wrap"
  },
  priceStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#393E46',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '98%',
    height: '98%',
    
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
  },
  submitButton: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#E57C23',
    borderRadius: 20,
    padding: 10,
    color: 'white',
    textAlign: 'center',
    padding: 10,
    padding: 10,
    alignSelf: 'center',
    marginTop: -10,
    width: '60%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  
  },
  closeButton: {
    padding: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    top: -10,
    left: -160,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  timePickerInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    padding: 20,
    flex: 1,
  },
  timePickerText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  googlePlacesContainer: {
    marginBottom: 20, // Adjust the margin to your preference
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  datePickerButton: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#E57C23',
    borderRadius: 20,
    padding: 10,
    color: 'white',
    textAlign: 'center'
  },
  datePickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateCalendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  
  },
  closeCalendarButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: 200,
    backgroundColor: '#E57C23'
  },
  closeCalendarButtonText: {
    backgroundColor: '#E57C23',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add some opacity to the background
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    height:'60%',
  },

  overlayTop: {
    flex: 1,
    marginRight: 10, // Add some spacing between caregiver info and book button
  },
  buttonStyle: {
    backgroundColor: '#E57C23',
    borderRadius: 20,
    padding: 10,
    color: 'white',
    textAlign: 'center'
  }, bioStyle: {
    fontSize: 16,
    marginTop: 10, // Add some spacing between bio and other caregiver info
    color: '#393E46',
  },
  roundCheckbox: {
    width: 24, // Set the width and height to make it round
    height: 24,
    borderRadius: 12, // Half of the width/height makes it round
    borderWidth: 1, // Add a border for better visibility
    borderColor: 'gray', // Border color for the checkbox
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Adjust the spacing between the checkbox and label
  },

  calendar: {
    width: 350, // Set the desired width (you can adjust this)
    height: 350, // Set the desired height (you can adjust this)
    borderRadius: 20
  },
  reviewModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reviewModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '98%',
    height: '98%',
  },
  reviewModalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeReviewModalButton: {
    backgroundColor: '#E57C23',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: 200,
    alignSelf: 'center',
  },
  closeReviewModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CaregiverProfile;
