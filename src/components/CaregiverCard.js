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
        <ScrollView horizontal={true} style={{backgroundColor:'white'}}>
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
                                size={14}
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
        flexDirection: 'column',
        alignItems: 'center',
        height: 240,
        width: 160,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginTop: 8,
        marginRight: 16,
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
        height: 120,
        width: 140,
        alignSelf: 'center',
        borderRadius: 16,
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    nameStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 12,
    },
    rateStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.5)",
        marginTop: 4,
    },
    perHourStyle: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.5)",
    },
});

export default CaregiverCard;