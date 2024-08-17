import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Rating } from 'react-native-stock-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const caregiverUrl = `https://sittrapi-production.up.railway.app/api/v1/careregivers/advertised`;
const caregiverImagesUrl = `https://sittrapi-production.up.railway.app/api/v1/allusers/images/`;

const AdvertisedCaregivers = ({userEmail}) => {
  const [caregivers, setCaregivers] = useState([]);
  const [getImage, setImage] = useState(require('../img/placeholder_img.png'));
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch the caregivers data from the API
    axios.get(caregiverUrl)
        .then(async response => {
            // Fetch the average rating and total ratings for each caregiver
            const caregiversWithRatings = await Promise.all(
                response.data.map(async caregiver => {
                    try {
                        const ratingResponse = await axios.get(
                            `https://sittrapi-production.up.railway.app/api/v1/caregivers/reviewstats/${caregiver.email}`
                        );
                        const { total_ratings, average_rating } = ratingResponse.data;

                        return {
                            ...caregiver,
                            total_ratings,
                            average_rating
                        };
                    } catch (error) {
                        console.error("Error fetching caregiver ratings:", error);
                        return caregiver;
                    }
                })
            );

            // Update the state with the fetched data
            setCaregivers(caregiversWithRatings);
        })
        .catch(error => {
            console.error("Error fetching caregivers:", error);
        });
}, []);
// The empty array [] ensures that the effect runs only once when the component mounts

  return (
    <ScrollView>
    <>
    {caregivers
        .filter(caregiver => caregiver.advertised === true)
        .map((caregiver, index) => (
          <View style={styles.cardStyle} key={index}>

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            
            <Image
  style={styles.imgStyle}
  source={{
    uri: caregiverImagesUrl + caregiver.profile_picture_url
  }}
  onError={() => {
    // If the image fails to load, display the placeholder image
    setImage(require('../img/placeholder_img.png'));
  }}
/>
          </View>
  

          <View style={{
            marginRight: 5,
            width: 110
          }}>
            <Text style={styles.textStyle}>{caregiver.advertised}</Text>
            

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Rating
                                    stars={caregiver.average_rating || 0} // Use the average rating, default to 0 if null
                                    maxStars={5}
                                    size={20}
                                    containerStyle={{ marginRight: 5 }}
                                />
                                <Text style={{ fontSize: 16 }}>
                                    ({caregiver.total_ratings || 0})
                                </Text>
                            </View>
          </View>

          <View style={{
             width: 100
          }}>
            <Text style={{
              fontSize: 25,
              fontWeight: 'bold'
            }}>R{caregiver.hourly_rate}<Text style={
              {
                fontSize: 20,
                color: 'rgba(0, 0, 0, 0.5)'
              }
            }> /h</Text></Text>
          </View>
          
       <TouchableOpacity  key={index}
          onPress={ () =>{

              navigation.navigate('CaregiverProfile', {
                userEmail: userEmail,
                caregiverEmail: caregiver.email,
                caregiverProfileUrl: caregiver.profile_picture_url,
              });

          }
          }>
            <View style={{
              marginLeft: 5
            }}>
              <Icon name="arrow-right" size={30} color="black" />
            </View>
          </TouchableOpacity>

        </View>
      ))}
    </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 100,
    width: 370,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.02)' ,
    marginTop: 10,
    borderWidth: 1, // Add a 1px border
    borderColor: 'rgba(0, 0, 0, 0.2)', // Faint border color
  
  },
  imgStyle: {
    height: 70,
    width: 70,
    borderRadius: 999,
    alignSelf: 'center',
    marginRight: 20
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#393E46',
    flexWrap:"wrap"
  }
});

export default AdvertisedCaregivers;
