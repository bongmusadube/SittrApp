import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ipConfig } from '../config';


const Messager = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [caregivers, setCaregivers] = useState([]);

  // Extract the user or caregiver email from the route
  const { userEmail } = route.params || {};

  // Function to load initial messages
  const loadMessages = (userEmail, caregiverEmail) => {
    // Fetch messages where the user is the receiver
    axios
      .get(`http://${ipConfig}:8080/api/v1/allusers/get-messages/${userEmail}/${caregiverEmail}`)
      .then((response) => {
        const filteredMessages = response.data
          .filter((message) => message.receiver === userEmail)
          .map((message) => ({
            _id: message.id?.toString() || Math.random().toString(36).substring(7),
            text: message.message,
            createdAt: new Date(message.timestamp),
            user: {
              _id: message.sender === userEmail ? '1' : '2', // User's messages are '1', other party is '2'
              name: message.sender === userEmail ? 'You' : 'Other',
            },
          }));
        setMessages(filteredMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  };
  
  // Load initial messages when the component mounts
  useEffect(() => {
    if (selectedCaregiver) {
      loadMessages(userEmail, selectedCaregiver.email);
    }
  }, [selectedCaregiver]);
  
  

  // Function to fetch caregivers
  const fetchCaregivers = () => {
    axios
      .get(`http://${ipConfig}:8080/api/v1/users/bookings/recent-caregivers/${userEmail}`)
      .then(async (response) => {
        const caregiversWithRatings = await Promise.all(
          response.data.map(async (caregiver) => {
            try {
              const ratingResponse = await axios.get(
                `http://${ipConfig}:8080/api/v1/caregivers/reviewstats/${caregiver.email}`
              );
              const { total_ratings, average_rating } = ratingResponse.data;

              return {
                ...caregiver,
                total_ratings,
                average_rating,
              };
            } catch (error) {
              console.error('Error fetching caregiver ratings:', error);
              return caregiver;
            }
          })
        );

        setCaregivers(caregiversWithRatings);
      })
      .catch((error) => {
        console.error('Error fetching caregivers:', error);
      });
  };

  // Load caregivers when the component mounts
  useEffect(() => {
    fetchCaregivers();
  }, []);

  const onSend = () => {
    // Send the new message to your API
    axios
      .post(`http://${ipConfig}:8080/api/v1/allusers/send-message`, {
        senderEmail: userEmail || caregiverEmail,
        receiverEmail: selectedCaregiver.email || userEmail,
        message: newMessage, // Use the newMessage state variable
      })
    
      .then((response) => {
        // Transform the response data into the format expected by GiftedChat
        const sentMessage = {
          _id: response.data.id.toString(), // Ensure _id is a string
          text: response.data.message,
          createdAt: new Date(response.data.timestamp),
          user: {
            _id: '1', // Ensure user._id is a string
            name: 'You',
          },
        };
        console.log(newMessage);
  
        // Add the sent message to the messages state
        setMessages((previousMessages) => GiftedChat.append(previousMessages, sentMessage));
        setNewMessage(''); // Clear the newMessage state after sending
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };
  const openChatModal = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setChatModalVisible(true);
    loadMessages(caregiver.email); // Fetch messages for the selected caregiver
  };
  

  const closeChatModal = () => {
    setSelectedCaregiver(null);
    setChatModalVisible(false);
  };
  const handleTextChange = (text) => {
    setNewMessage(text);
    console.log(newMessage);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messager</Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {caregivers.map((caregiver, index) => (
            <TouchableOpacity
              key={index}
              style={styles.caregiverCard}
              onPress={() => openChatModal(caregiver)}
            >
              <Image
                style={styles.caregiverImage}
                source={{
                  uri: `http://${ipConfig}:8080/api/v1/allusers/images/${caregiver.profile_picture_url}`,
                }}
                onError={() => {
                  // If the image fails to load, display the placeholder image
                  //setImage(require('../img/placeholder_img.png'));
                }}
              />
              <Text style={styles.caregiverName}>{caregiver.fullname}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {selectedCaregiver && (
        <Modal visible={isChatModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
            <TouchableOpacity
                       onPress={closeChatModal}
                       style={styles.closeButtonChat}
                     
                      >
                          <Icon name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <GiftedChat
       messages={messages}
  user={{
    _id: '1', // Ensure user._id is a string
  }}
  onSend={(messages) => onSend(messages)} // Handle sending messages
  renderBubble={(props) => (
    <Bubble
    {...props}
    wrapperStyle={
      props.currentMessage.user._id === '1'
        ? { right: { backgroundColor: '#007AFF' } } // User's messages are blue
        : { left: { backgroundColor: '#EFEFF3' } } // Received messages are grey
    }
    textStyle={styles.text}
  />
  )}
  text={newMessage}
  onInputTextChanged = {handleTextChange}
  renderSend={() => null} // Hide the send button
  renderUsernameOnMessage={true}
  inverted={true}
/>


      
          </View>
        </Modal>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E57C23',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  caregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF3',
  },
  caregiverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  caregiverName: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  bubbleLeft: {
    backgroundColor: '#EFEFF3',
  },
  bubbleRight: {
    backgroundColor: '#007AFF',
  },
  text: {
    color: 'black',
  },
  inputToolbarContainer: {
    backgroundColor: '#EFEFF3',
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 4,
    marginBottom: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  bubbleLeft: {
    backgroundColor: '#EFEFF3', // Gray background for received messages
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 60,
  },
  bubbleRight: {
    backgroundColor: '#007AFF', // Blue background for sent messages
    borderRadius: 15,
    marginLeft: 60,
    marginRight: 10,
  },
  text: {
    color: 'black',
  },
  inputToolbarContainer: {
    backgroundColor: '#EFEFF3',
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 4,
    marginBottom: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFF3',
    borderTopWidth: 1,
    borderTopColor: '#EFEFF3',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  closeButtonChat: {
    marginRight: 350,
    marginTop: 20,
    marginBottom: 20
   
  }
});

export default Messager;
