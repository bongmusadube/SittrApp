import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const MessagerCaregiver = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  // Extract the caregiver email from the route
  const { caregiverEmail } = route.params || {};

  // Function to load initial messages
  const loadMessages = (caregiverEmail, user_email) => {
    // Fetch messages where the caregiver is the receiver
    axios
      .get(
        `https://sittrapi-production.up.railway.app/api/v1/allusers/get-messages/${caregiverEmail}/${user_email}`
      )
      .then((response) => {
        const filteredMessages = response.data
          .filter((message) => message.receiver === caregiverEmail)
          .map((message) => ({
            _id: message.id?.toString() || Math.random().toString(36).substring(7),
            text: message.message,
            createdAt: new Date(message.timestamp),
            user: {
              _id: '2', // Always set the user ID to '2' for received messages
              name: 'User', // Set the name to 'User' for received messages
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
    if (selectedUser) {
      loadMessages(caregiverEmail, selectedUser.email);
    }
  }, [selectedUser]);

  // Function to fetch recent users who booked the caregiver
  const fetchRecentUsers = () => {
    axios
      .get(
        `https://sittrapi-production.up.railway.app/api/v1/caregivers/recent-users/${caregiverEmail}`
      )
      .then(async (response) => {
        setRecentUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recent users:', error);
      });
  };

  // Load recent users when the component mounts
  useEffect(() => {
    fetchRecentUsers();
  }, []);

  // Function to send a new message
  const onSend = () => {
    // Send the new message to your API
    axios
      .post(`https://sittrapi-production.up.railway.app/api/v1/allusers/send-message`, {
        senderEmail: caregiverEmail,
        receiverEmail: selectedUser.email,
        message: newMessage,
      })
      .then((response) => {
        // Transform the response data into the format expected by GiftedChat
        const sentMessage = {
          _id: response.data.id.toString(),
          text: response.data.message,
          createdAt: new Date(response.data.timestamp),
          user: {
            _id: '1',
            name: 'You',
          },
        };

        // Add the sent message to the messages state
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, sentMessage)
        );
        setNewMessage(''); // Clear the newMessage state after sending
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  const openChatModal = (user) => {
    setSelectedUser(user);
    setChatModalVisible(true);
    loadMessages(caregiverEmail, user.email);
  };

  const closeChatModal = () => {
    setSelectedUser(null);
    setChatModalVisible(false);
  };

  const handleTextChange = (text) => {
    setNewMessage(text);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messenger</Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {recentUsers.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userCard}
              onPress={() => openChatModal(user)}
            >
                <Image
                style={styles.imageStyle}
                source={{
                  uri: `https://sittrapi-production.up.railway.app/api/v1/allusers/images/placeholder_img.png`,
                }}
                onError={() => {
                  // If the image fails to load, display the placeholder image
                  setImage(require('../img/placeholder_img.png'));
                }}
              />
              <Text style={styles.userName}>{user.fullname}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {selectedUser && (
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
                _id: '1',
              }}
              onSend={onSend}
              renderBubble={(props) => (
                <Bubble
                  {...props}
                  wrapperStyle={
                    props.currentMessage.user._id === '1'
                      ? { right: { backgroundColor: '#007AFF' } }
                      : { left: { backgroundColor: '#EFEFF3' } }
                  }
                />
              )}
              text={newMessage}
              onInputTextChanged={handleTextChange}
              renderSend={() => null}
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
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF3',
  },
  userName: {
    fontSize: 16,
    color: 'black'
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
  closeButtonChat: {
    marginRight: 350,
    marginTop: 20,
    marginBottom: 20
   
  }
});

export default MessagerCaregiver;
