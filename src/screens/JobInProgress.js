import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const JobInProgress = ({ route }) => {
  const { bookingId } = route.params;
  const [bookingDetails, setBookingDetails] = useState();
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [notesInput, setNotesInput] = useState('');
  const [careLog, setCareLog] = useState({
    notes: '',
    rating: 0,
    attachments: [], // You can adjust the structure based on your needs
  });
  const [jobCompleted, setJobCompleted] = useState(false); // State for job completion

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
    axios
    .get(`https://sittrapi-production.up.railway.app/api/v1/bookings/${bookingId}`)
    .then((response) => {
      setBookingDetails(response.data);

      // Fetch the user's full name
      fetchUserFullName(response.data.user_email).then((fullName) => {
        setBookingDetails((prevBookingDetails) => ({
          ...prevBookingDetails,
          userFullName: fullName,
        }));
      });
    })
    .catch((error) => {
      console.error('Error fetching booking details:', error);
    });
}, [bookingId]);

  if (!bookingDetails) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }



  const handleNotesChange = (text) => {
    setCareLog((prevLog) => ({ ...prevLog, notes: text }));
  };

  const handleRatingChange = (rating) => {
    setCareLog((prevLog) => ({ ...prevLog, rating }));
  };

  const handleAttachmentAdd = (attachment) => {
    setCareLog((prevLog) => ({
      ...prevLog,
      attachments: [...prevLog.attachments, attachment],
    }));
  };



  const handleCompleteJob = async () => {
    console.log(notesInput);
    try {
      await axios.patch(`https://sittrapi-production.up.railway.app/api/v1/bookings/${bookingId}/complete`, {
        status: 'complete', // Update status
        caregiver_comment: notesInput,
      });

      console.log('Booking status updated to complete');
      closeModal();
      setJobCompleted(true);

      // Show an alert
      Alert.alert('Job Completed', 'The job has been marked as complete.');

    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };



  const handleSubmitCareLog = () => {
    // Here you can submit the care log to your backend
    // You can use the careLog object for the data to be sent
    // Reset the careLog state after submission

    // For demonstration purposes, I'm logging the care log data here
    console.log('Care Log Submitted:', careLog);

    setCareLog({
      notes: '',
      rating: 0,
      attachments: [],
    });
    closeModal();
  };

  



  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!bookingId) {
    return (
        <View style={styles.centerContainer}>
        <Text style={styles.noJobText}>No Job in Progress</Text>
      </View>
    );
  }





  return (
    <View style={styles.bookingContainer}>
    <Text style={styles.heading}>Job In Progress</Text>
    <View style={styles.infoContainer}>
      <Text style={styles.cardHeader}>{bookingDetails.userFullName}'s Kids</Text>
      <Text style={styles.leftHeader}>Start Time: {bookingDetails.start_time}</Text>
      <Text style={styles.leftHeader}>End Time: {bookingDetails.end_time}</Text>
      <Text style={styles.leftHeader}>Number of Kids: {bookingDetails.number_of_kids}</Text>
      <View style={styles.addressContainer}>
        <Icon name="map-marker" size={24} color="black" style={styles.mapIcon} />
        <Text style={styles.addressStyle}>{bookingDetails.user_homeaddress}</Text>
      </View>
      <Text style={styles.leftHeader}>Booking Dates:</Text>
      {bookingDetails.selected_dates.map((date, index) => (
        <Text style={styles.dateStyle} key={index}>{date}</Text>
      ))}
      <Text style={styles.leftHeader}>Special Needs: {bookingDetails.special_needs ? 'Yes' : 'No'}</Text>
      <Text style={styles.leftHeader}>Transport: {bookingDetails.transport_needs ? 'Yes' : 'No'}</Text>
      <Text style={styles.leftHeader}>Comment: {bookingDetails.comments}</Text>
    </View>
    {jobCompleted ? (
      <Text style={styles.completedText}>Job Completed</Text>
    ) : (
      <TouchableOpacity onPress={openModal} style={styles.completeButton}>
        <Text style={styles.completeButtonText}>Complete Job</Text>
      </TouchableOpacity>
    )}
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Care Log</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Add notes about the job..."
              value={notesInput}
              onChangeText={setNotesInput}
            />
            {jobCompleted ? (
              <Text style={styles.completedText}>Job Completed</Text>
            ) : (
              <TouchableOpacity onPress={handleCompleteJob} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);
};
const styles = StyleSheet.create({
  cardHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey'
  },
  leftHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    color: 'grey'
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
  completedText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 25
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
    fontWeight: 'bold',
    color: 'grey'
  },
  priceText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey'
  },
  noBookingsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
  },


    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noJobText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: 'black'
    },
    bookingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'white',
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'grey'
      },
      infoContainer: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
      },
      infoText: {
        marginBottom: 10,
        color: 'grey'
      },
      completeButton: {
        marginTop: 20,
        backgroundColor: '#E57C23',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
      },
      completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'grey',
        textAlign: 'center',
      },
      notesInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 10,
        marginBottom: 15,
        height: 100,
      },
      submitButton: {
        backgroundColor: '#E57C23',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 10,
        
      },
      submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        height: '40%',
        justifyContent: 'space-between', 
  flexDirection: 'column', 
        
      },
      closeButtonText:
      {
        
        textAlign: 'center',
      },
      modalOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'transparent', 
        justifyContent: 'center',
        alignItems: 'center',
      },
  });

export default JobInProgress;
