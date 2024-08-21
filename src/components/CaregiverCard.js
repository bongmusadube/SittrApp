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
                    <View style={styles.imageContainer}>
                        <Image style={styles.imgStyle} source={{ uri: caregiverImagesUrl + caregiver.profile_picture_url }} />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.nameStyle}>{caregiver.fullname}</Text>
                    
                        <View style={styles.ratingContainer}>
                            <Rating
                                stars={caregiver.average_rating || 0}
                                maxStars={5}
                                size={16}
                                containerStyle={{ marginRight: 5 }}
                            />
                            <Text style={styles.ratingText}>
                                ({caregiver.total_ratings || 0})
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.rateStyle}>
                        R{caregiver.hourly_rate}<Text style={styles.perHourStyle}>/h</Text>
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CaregiverProfile', {
                                userEmail: userEmail,
                                caregiverEmail: caregiver.email,
                                caregiverProfileUrl: caregiver.profile_picture_url,
                            });
                        }}
                        style={styles.arrowContainer}
                    >
                        <Icon name="arrow-right" size={24} color="black" />
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
        height: 280,
        width: 200,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginTop: 10,
        marginRight: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgStyle: {
        height: 150,
        width: 180,
        alignSelf: 'center',
        borderRadius: 20,
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    nameStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        fontSize: 14,
    },
    rateStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.5)",
        marginTop: 5,
    },
    perHourStyle: {
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.5)",
    },
    arrowContainer: {
        marginTop: 5,
    },
});

export default CaregiverCard;
