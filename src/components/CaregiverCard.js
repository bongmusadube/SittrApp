import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Image, View, Text, ScrollView } from "react-native";
import { Rating } from "react-native-stock-star-rating";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const caregiverUrl = `https://sittrapi-production.up.railway.app/api/v1/caregivers`;
const caregiverImagesUrl = `https://sittrapi-production.up.railway.app/api/v1/allusers/images/`;

const CaregiverCard = ({userEmail}) => {
    const [caregivers, setCaregivers] = useState([]);
    const navigation = useNavigation();

    const navigateToProfile = () => {
        navigation.navigate('CaregiverProfile', {
          userEmail: caregiver.userEmail, // Replace with the appropriate prop from your data
          caregiverEmail: caregiver.email,
          caregiverProfileUrl: caregiver.profile_picture_url,
        });
      };

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
    }, []);// The empty array [] ensures that the effect runs only once when the component mounts

    return (
        <ScrollView horizontal={true} style={{backgroundColor:'white'}}>
            {caregivers.map((caregiver, index) => (
                <View style={styles.cardStyle} key={index}>
                    <View style= {{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Image style={styles.imgStyle} source={{ uri: caregiverImagesUrl + caregiver.profile_picture_url }} />
                    </View>

                    <View style={{ flexWrap: 'wrap', 
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                         }}>
                        <Text style={{...styles.textStyle,flexWrap: 'wrap', 
                                textAlign: 'center'}}>{caregiver.fullname}</Text>
                    
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

                    <View>
                        <Text style={{ fontSize: 25, fontWeight: "bold", color: "rgba(0, 0, 0, 0.5)" }}>
                        R{caregiver.hourly_rate}<Text style={{ fontSize: 20, color: "rgba(0, 0, 0, 0.5)" }}>/h</Text>
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CaregiverProfile', {
                                userEmail: userEmail,
                                caregiverEmail: caregiver.email,
                                caregiverProfileUrl: caregiver.profile_picture_url,
                            });
                        }}
                    >
                        <View>
                        <View style={{}}>
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
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 340,
        width: 250,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginTop: 10,
        marginRight: 30,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    imgStyle: {
        height: 200,
        width: 250,
        alignSelf: 'center',
        borderRadius: 25,
        
        
    },
    textStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'grey'
        
    }
});

export default CaregiverCard;
