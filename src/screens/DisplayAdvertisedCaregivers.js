//import libaries
import React from 'react';
import {View, Text, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';

import Header from '../components/header';
import CaregiverDetails from '../components/CaregiverDetails';
import CaregiverCard from '../components/CaregiverCard';
import { useRoute } from '@react-navigation/native';
import AdvertisedCaregivers from '../components/AdvertisedCaregivers';
import AdvertisedCaregiverDetails from '../components/AdvertisedCaregiverDetails';




//create component
const DisplayAdvertisedCaregivers = () => {
  const route = useRoute();
  const userEmail = route.params?.userEmail;

  
  return (
<SafeAreaView style={{ flex: 1, 
         backgroundColor: 'white'}}>
     <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white'
     }} >
       <TouchableOpacity style = {{
              backgroundColor: '#E57C23',
              borderRadius: 20,
              textAlign: 'center',
              padding: 10  

       }}><Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>In Johannesburg, Auckland Park</Text></TouchableOpacity>
     </View>

      <Header title={'Advertised Caregivers'} />

      <ScrollView style={{backgroundColor: 'white', marginLeft: 10}}>
        <AdvertisedCaregiverDetails userEmail={userEmail} style={{marginLeft: 20}} />
      
      </ScrollView>
    </SafeAreaView>
  )
};

//render component
export default DisplayAdvertisedCaregivers;