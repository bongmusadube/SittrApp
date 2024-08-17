import { View, Text } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const GooglePlacesAutoComplete = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // Handle the selected place data
        console.log(data, details);
      }}
      query={{
        key: 'YOUR_GOOGLE_MAPS_API_KEY',
        language: 'en', // You can change the language preference
      }}
    />
  )
}

export default GooglePlacesAutoComplete