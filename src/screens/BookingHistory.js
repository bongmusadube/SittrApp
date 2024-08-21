import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from '@rneui/themed';

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
    axios.get(`https://sittrapi-production.up.railway.app/api/v1/bookings/user/${userEmail}`)
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setIsError(true); // Set a state variable to indicate an error
      });
  }, [userEmail]);

  const handleRatingCompleted = (newRating) => {
    setRating(newRating);
  };

  const openReviewModal = () => {
    setReviewModalVisible(true);
  };

  const closeReviewModal = () => {
    setReviewModalVisible(false);
  };

  const handleSubmitReview = (selectedBookingId) => {
    if (rating && comment) {
      axios.patch(`https://sittrapi-production.up.railway.app/api/v1/bookings/review/${selectedBookingId}`, {
        caregiver_rating: rating,
        review_comment: comment
      })
      .then(response => {
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
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>Booking Details</Text>
                <Text style={styles.headerText}>Status: {booking.booking_status}</Text>
              </View>
              <View style={styles.bookingDetails}>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>Start Time: {booking.start_time}</Text>
                  <Text style={styles.detailsText}>End Time: {booking.end_time}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>Booking Dates:</Text>
                  {booking.selected_dates.map((date, index) => (
                    <Text style={styles.dateText} key={index}>{date}</Text>
                  ))}
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>Caregiver Email: {booking.caregiver_email}</Text>
                  <Text style={styles.detailsText}>Caregiver Comment: {booking.caregiver_comment}</Text>
                </View>
              </View>
              {booking.booking_status === 'complete' && (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => {
                    setSelectedBookingId(booking.id);
                    setReviewModalVisible(true);
                  }}
                >
                  <Text style={styles.reviewButtonText}>Review</Text>
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
                  placeholderTextColor="#999"
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleSubmitReview(selectedBookingId)}
                  >
                    <Text style={styles.modalButtonText}>Submit Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setReviewModalVisible(false);
                      setRating(0);
                      setComment('');
                    }}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: '#f4f4f4',
  },
  scrollContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  bookingCard: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailsContainer: {
    marginVertical: 4,
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
  },
  dateText: {
    backgroundColor: '#e57c23',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 5,
    color: '#fff',
    fontSize: 14,
  },
  reviewButton: {
    backgroundColor: '#e57c23',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noBookingsText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  commentInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 12,
    color: '#333',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  modalButton: {
    backgroundColor: '#e57c23',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingHistory;