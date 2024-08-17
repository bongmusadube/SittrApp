import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';
import { ipConfig } from '../config';

const GiftedChatModal = ({ visible, onClose, user, caregiverEmail }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const onSend = () => {
    // Send the new message to your API
    axios
      .post(`http://${ipConfig}:8080/api/v1/allusers/send-message`, {
        senderEmail: user.email,
        receiverEmail: caregiverEmail,
        message: newMessage,
      })
      .then((response) => {
        const sentMessage = {
          _id: response.data.id.toString(),
          text: response.data.message,
          createdAt: new Date(response.data.timestamp),
          user: {
            _id: '1',
            name: 'You',
          },
        };

        setMessages((previousMessages) => GiftedChat.append(previousMessages, sentMessage));
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
              _id: '1',
            }}
            renderBubble={(props) => (
              <Bubble
                {...props}
                textStyle={styles.text}
              />
            )}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={styles.inputToolbarContainer}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalContent: {
    flex: 1,
  },
  text: {
    color: 'black',
  },
  inputToolbarContainer: {
    backgroundColor: '#EFEFF3',
  },
});

export default GiftedChatModal;
