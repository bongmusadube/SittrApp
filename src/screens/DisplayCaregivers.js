import React from 'react';
import {View, Text, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import Header from '../components/header';
import CaregiverDetails from '../components/CaregiverDetails';
import CaregiverCard from '../components/CaregiverCard';
import { useRoute } from '@react-navigation/native';




//create component
const DisplayCaregivers = () => {
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
      <Header title={'Recommended Caregivers '} />

      <View style={{ backgroundColor: 'white' }}>
        <ScrollView horizontal={true} style={{  backgroundColor: 'white', marginLeft: 10}}>
          <CaregiverCard  userEmail={userEmail}/>
        </ScrollView>
      </View>

      <Header title={'Available Caregivers'} />

      <ScrollView style={{backgroundColor: 'white', marginLeft: 10}}>
        <CaregiverDetails userEmail={userEmail} style={{marginLeft: 20}} />
      
      </ScrollView>
    </SafeAreaView>
 
       
  
       
  )
};

export default DisplayCaregivers;