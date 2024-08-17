import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { ipConfig } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-stock-star-rating';
import { AirbnbRating } from '@rneui/themed'; // Import AirbnbRating

const BookingHistory = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userEmail } = route.params || {};
  console.log(userEmail + ' Booking History');
  const [bookings, setBookings] = useState([]);
  const [isError, setIsError] = useState(false);

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  
  

  useEffect(() => {

    // Fetch bookings for the specific user
    axios.get(`http://${ipConfig}:8080/api/v1/bookings/user/${userEmail}`)
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setIsError(true); // Set a state variable to indicate an error
      });
  }, [userEmail]);



  const handleRatingCompleted = (newRating) => {
    console.log(rating);
    setRating(newRating);
  };

  const openReviewModal = () => {
    setReviewModalVisible(true);
  };

  const closeReviewModal = () => {
    setReviewModalVisible(false);
  };


  const handleSubmitReview = (selectedBookingId) => {
    // Assuming rating and comment are already set
    if (rating && comment) {
      // Send the rating and comment to the server
      axios.patch(`http://${ipConfig}:8080/api/v1/bookings/review/${selectedBookingId}`, {
        caregiver_rating: rating,
        review_comment: comment
      })
      .then(response => {
        // Handle success if needed
        console.log('Review submitted successfully');
        closeReviewModal();
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
    }
  };

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Booking History</Text>
        {bookings.length === 0 ? (
          <Text style={styles.noBookingsText}>No Booking History</Text>
        ) : (
          bookings.map(booking => (
            <View key={booking.id} style={styles.bookingCard}>
              <Text style={styles.cardHeader}>Booking Details</Text>
              <Text style={styles.leftHeader}>Start Time: {booking.start_time}</Text>
              <Text style={styles.leftHeader}>End Time: {booking.end_time}</Text>
              <Text style={styles.leftHeader}>Booking Dates:</Text>
              {booking.selected_dates.map((date, index) => (
                <Text style={styles.dateStyle} key={index}>{date}</Text>
              ))}
                <Text style={styles.leftHeader}>Caregiver Email: {booking.caregiver_email}</Text>
                <Text style={styles.leftHeader}>Caregiver Comment: {booking.caregiver_comment}</Text>
              <Text style={styles.leftHeader}>Status: {booking.booking_status}</Text>

              {booking.booking_status === 'complete' && (
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    setSelectedBookingId(booking.id);
                    setReviewModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Review</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

<Modal
          visible={reviewModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Leave a Review</Text>
               <AirbnbRating
                count={5}
                reviews={['Terrible', 'Bad', 'Ok', 'Good', 'Great']}
                defaultRating={rating}
                onFinishRating={handleRatingCompleted}
              />
              <TextInput
                placeholder="Leave a comment..."
                value={comment}
                onChangeText={setComment}
                multiline={true}
                style={styles.commentInput}
              />
              <TouchableOpacity
               style={styles.buttonStyle}
               onPress={() => handleSubmitReview(selectedBookingId)}

              >
                <Text style={styles.buttonText}>Submit Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => {
                  setReviewModalVisible(false);
                  setRating(0);
                  setComment('');
                }}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
  leftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'left',
  },
  bookingCard: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  noBookingsText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'grey',
    textAlign: 'center',
  },   modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    height: '40%',
    justifyContent: 'space-between', 
    alignItems: 'center',
flexDirection: 'column', 
    
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },   submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: '#E57C23',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    color: 'white',
    textAlign: 'center'
  },
  buttonText:{
    textAlign: 'center',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  leftHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
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
});

export default BookingHistory;
