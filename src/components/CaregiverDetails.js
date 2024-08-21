import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Image, View, Text, ScrollView } from "react-native";
import { Rating } from "react-native-stock-star-rating";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const caregiverUrl = `https://sittrapi-production.up.railway.app/api/v1/caregivers`;
const caregiverImagesUrl = `https://sittrapi-production.up.railway.app/api/v1/allusers/images/`;

const CaregiverDetails = ({userEmail}) => {
    const [caregivers, setCaregivers] = useState([]);
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

    return (
        <ScrollView style={{backgroundColor:'white'}}>
            {caregivers.map((caregiver, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        navigation.navigate('CaregiverProfile', {
                            userEmail: userEmail,
                            caregiverEmail: caregiver.email,
                            caregiverProfileUrl: caregiver.profile_picture_url,
                        });
                    }}
                    style={styles.cardStyle}
                >
                    <View style={styles.imageContainer}>
                        <Image style={styles.imgStyle} source={{ uri: caregiverImagesUrl + caregiver.profile_picture_url }} />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.nameStyle} numberOfLines={2}>{caregiver.fullname}</Text>
                    
                        <View style={styles.ratingContainer}>
                            <Rating
                                stars={caregiver.average_rating || 0}
                                maxStars={5}
                                size={20}
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
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        width: '90%',
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginTop: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgStyle: {
        height: 70,
        width: 70,
        borderRadius: 999,
        alignSelf: 'center',
        marginRight: 16
    },
    infoContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    nameStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 16,
    },
    rateStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.5)",
        marginRight: 15
    },
    perHourStyle: {
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.5)",
    },
});

export default CaregiverDetails;