import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Modal, RefreshControl, FlatList } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BookingRequests = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { caregiverEmail } = route.params || {};
  console.log(caregiverEmail + ' Booking');
  const [bookings, setBookings] = useState([]);
  const [isError, setIsError] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); // To store the selected booking for the modal
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [refreshing, setRefreshing] = useState(false);

  const toggleModal = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(!modalVisible);
  };
  // Function to fetch user's full name
  const fetchUserFullName = async (email) => {
    try {
      const response = await axios.get(`https://sittrapi-production.up.railway.app/api/v1/users/${email}`);
      return response.data[0]?.fullname || '';
    } catch (error) {
      console.error('Error fetching user full name:', error);
      return '';
    }
  };

  useEffect(() => {
    // Fetch bookings for the specific caregiver
    axios
      .get(`https://sittrapi-production.up.railway.app/api/v1/bookings/caregiver/${caregiverEmail}`)
      .then(async (response) => {
        const updatedBookings = await Promise.all(
          response.data.map(async (booking) => {
            // Fetch user's full name and update the booking object
            const fullName = await fetchUserFullName(booking.user_email);
            return {
              ...booking,
              userFullName: fullName,
            };
          })
        );
        setBookings(updatedBookings);
      })
      .catch((error) => {
        //console.log('Error fetching bookings:', error);
        setIsError(true); // Set a state variable to indicate an error
      });
  }, [caregiverEmail]);

  

  const handleStatusChange = (bookingId, newStatus, selectedDates) => {
    axios.patch(`https://sittrapi-production.up.railway.app/api/v1/bookings/${bookingId}`, {
      booking_status: newStatus,
    })
    .then(response => {
      // Update the status in the local state
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, booking_status: newStatus };
        }
        return booking;
      });
      setBookings(updatedBookings);
  
      // Update the caregiver's booked_dates when the booking is accepted
      if (newStatus === 'accepted') {
        axios.patch(`https://sittrapi-production.up.railway.app/api/v1/caregivers/update-booked-dates/${caregiverEmail}`, {
          selectedDates: selectedDates,
        })
        .then(response => {
          console.log('Caregiver booked_dates updated successfully:', response.data);
        })
        .catch(error => {
          console.error('Error updating caregiver booked_dates:', error);
        });
      }
  
      // Navigate to JobInProgress with booking id as parameter if the status is 'in_progress'
      if (newStatus === 'in_progress') {
        navigation.navigate('JobInProgress', { bookingId: bookingId }); // Pass the booking id
      }
    })
    .catch(error => {
      console.error('Error updating booking status:', error);
    });
  };

  const calculateEarnings = (booking) => {
    if (!booking || typeof booking !== 'object') {
      console.log('Invalid booking data');
      return 0; // Or any appropriate default value
    }
  
    const hourlyRate = booking.hourly_rate || 0; // Provide a default hourly rate if not available
    const selectedDates = booking.selected_dates || []; // Use an empty array if selected_dates is not available
    const startTime = new Date(booking.start_time); // Convert to Date object
    const endTime = new Date(booking.end_time); // Convert to Date object
  
    if (isNaN(hourlyRate) || isNaN(startTime) || isNaN(endTime) || !Array.isArray(selectedDates)) {
      console.log('Invalid or missing data in booking');
      return 0; // Or any appropriate default value
    }
  
    // Calculate the total number of hours for all selected dates
    let totalHours = 0;
    for (const date of selectedDates) {
      const dateStart = new Date(date + ' ' + startTime.toLocaleTimeString()); // Combine date and time
      const dateEnd = new Date(date + ' ' + endTime.toLocaleTimeString()); // Combine date and time
      const timeDiff = dateEnd - dateStart;
      const hours = timeDiff / (1000 * 60 * 60);
      totalHours += hours;
  
      console.log('Date:', date);
      console.log('Combined Start Time:', dateStart);
      console.log('Combined End Time:', dateEnd);
      console.log('Time Difference (hours):', hours);
    }
  
    if (isNaN(totalHours) || totalHours <= 0) {
      console.log('Invalid number of hours');
      return 0; // Or any appropriate default value
    }
  
    console.log('Total Hours:', totalHours);
  
    const earnings = hourlyRate * totalHours;
    console.log('Earnings:', earnings);
    return earnings;
  };
  
  const refresh = async () => {
    try {
      setRefreshing(true); // Start the refresh animation
  
      // Fetch new data from the database
      const response = await axios.get(`https://sittrapi-production.up.railway.app/api/v1/bookings/caregiver/${caregiverEmail}`);
      const updatedBookings = await Promise.all(
        response.data.map(async (booking) => {
          const fullName = await fetchUserFullName(booking.user_email);
          return {
            ...booking,
            userFullName: fullName,
          };
        })
      );
  
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setRefreshing(false); // Stop the refresh animation
    }
  };
  
  
  
  
  // Separate the bookings into "New Booking Requests" and "Accepted Requests"
  const newBookingRequests = bookings.filter((booking) => booking.booking_status === 'pending');
  const acceptedRequests = bookings.filter((booking) => booking.booking_status === 'accepted');

  return (


    <SafeAreaView style={styles.container}>
    <FlatList
      contentContainerStyle={styles.scrollContent}
      data={bookings}
      renderItem={({ item: booking }) => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>New Booking Requests</Text>
        {bookings.length === 0 ? (
          <Text style={styles.noBookingsText}>No booking Received</Text>
        ) : (
          bookings
        
          .filter((booking) => booking.booking_status !== 'complete')
          .map(booking => (
       
             booking.booking_status !== 'in_progress' && (

              
            <View key={booking.id} style={styles.bookingCard}>
                     <Text style={styles.cardHeader}>{booking.userFullName}'s Kids</Text>
                
                     <Text style={styles.priceText}>R{booking.total_amount}</Text>
                <Text style={styles.leftHeader}>Number of Kids: {booking.number_of_kids}</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                     
                  <Icon name="map-marker" size={24} color="black" style={{
                    marginRight: 10
                  }} />
                   <Text style={styles.addressStyle}>{booking.user_homeaddress}</Text>
                </View>
            <Text style={styles.leftHeader}>Booking Dates:</Text>
              {booking.selected_dates.map((date, index) => (
                <Text style={styles.dateStyle} key={index}>{date}</Text>
              ))}
                <TouchableOpacity onPress={() => toggleModal(booking)} style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                      <Text style={styles.leftHeader}>View More Information</Text>
                  <Icon name="info-circle" size={24} color="black" style={{
                    marginLeft: 10
                  }} />
                </TouchableOpacity>
           


           
            
                {modalVisible && selectedBooking && selectedBooking.id === booking.id && (
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      toggleModal(null);
                    }}
                  >
                   
                    <View style={styles.modalContainer}>
                    <TouchableOpacity
                        onPress={() => toggleModal(null)}
                        style={styles.closeModalButton}
                      >
                          <Icon name="arrow-left" size={24} color="black" />
                      </TouchableOpacity>
                      <Text style={styles.cardHeader}>{booking.userFullName}'s Kids</Text>
                      <Text style={styles.leftHeader}>Start Time: {selectedBooking.start_time}</Text>
                      <Text style={styles.leftHeader}>End Time: {selectedBooking.end_time}</Text>
                      <Text style={styles.leftHeader}>Number of Kids: {booking.number_of_kids}</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                     
                  <Icon name="map-marker" size={24} color="black" style={{
                    marginRight: 10
                  }} />
                   <Text style={styles.addressStyle}>{booking.user_homeaddress}</Text>
                </View>
            <Text style={styles.leftHeader}>Booking Dates:</Text>
              {booking.selected_dates.map((date, index) => (
                <Text style={styles.dateStyle} key={index}>{date}</Text>
              ))}
             
            <Text style={styles.leftHeader}>Special Needs: {booking.special_needs ? 'Yes' : 'No'}</Text>
            <Text style={styles.leftHeader}>Transport: {booking.transport_needs ? 'Yes' : 'No'}</Text>
            <Text style={styles.leftHeader}>Comment: {booking.comments}</Text>
                    
                    </View>
                  </Modal>
                )}
            
            {booking.booking_status === 'pending' && (
              <View style={styles.buttonsContainer}>
             <TouchableOpacity
  style={[styles.button, styles.acceptButton]}
  onPress={() => handleStatusChange(booking.id, 'accepted', booking.selected_dates)}
>
  <Text style={styles.buttonText}>Accept</Text>
</TouchableOpacity>
<TouchableOpacity
  style={[styles.button, styles.rejectButton]}
  onPress={() => handleStatusChange(booking.id, 'rejected', booking.selected_dates)}
>
  <Text style={styles.buttonText}>Reject</Text>
</TouchableOpacity>

              </View>
            )}
           
            {booking.booking_status === 'accepted' && (
              <View>
                <Text style={styles.status}>Status: Accepted</Text>
                <TouchableOpacity
                  style={styles.startJobButton}
                  onPress={() => handleStatusChange(booking.id, 'in_progress')}
                >
                  <Text style={styles.buttonText}>Start Job</Text>
                </TouchableOpacity>
              </View>
            )}
    
            {booking.booking_status === 'rejected' && (
              <Text style={styles.status}>Status: Rejected</Text>
            )}
          </View>
             ) 

            
          ))
        )}
      </ScrollView>

      )}
      keyExtractor={(booking) => booking.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor="#000" // Customize the loading indicator color
          title="Pull to Refresh" // Customize the text shown while refreshing
        />
      }
    />
  </SafeAreaView>
  );

  
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  bookingCard: {
    width: 350,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  cardHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  leftHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  startJobButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  }, modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 600,
    width: 350,
    backgroundColor: '#f0f0f0',
    marginTop: 100,
    marginLeft: 25,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1
  },
  closeModalButton: {
    marginRight: 250,
    marginTop: -80,
    marginBottom: 20
   
  },
  dateStyle: {
    backgroundColor: '#E57C23',
    borderRadius: 20,
    width: 90,
    padding: 5,
    color: 'white',
    textAlign: 'center',
    marginTop: 5
  },
  addressStyle:
  {
    fontSize: 20,
    flexWrap: 'wrap',
    fontWeight: 'bold'
  },
  priceText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noBookingsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },

});

export default BookingRequests;
