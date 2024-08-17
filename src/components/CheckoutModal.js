import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const CheckoutModal = () => {
  return (
     
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.checkoutContainer}>
           
            <TouchableOpacity onPress={handleFormSubmit}>
              <Text>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </Modal>
  )
}

export default Checkout