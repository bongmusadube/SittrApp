import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import { Rating } from 'react-native-stock-star-rating'; // Assuming you have a Rating component
import axios from 'axios';

const caregiverUrl = `https://sittrapi-production.up.railway.app/api/v1/caregivers`;
const imagesUrl = `https://sittrapi-production.up.railway.app/api/v1/allusers/images/`;

const ProfileScreenCaregiver = ({ route }) => {
  const [caregiver, setCaregiver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  useEffect(() => {
    // Fetch caregiver's profile information
    axios.get(`${caregiverUrl}/${route.params.caregiverEmail}`)
      .then(response => {
        setCaregiver(response.data);
      

       
      })
      .catch(error => {
        console.error('Error fetching caregiver profile:', error);
      });

    // Fetch caregiver's recent reviews
    axios.get(`${caregiverUrl}/reviews/${route.params.caregiverEmail}`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching caregiver reviews:', error);
      });

      axios.get(`${caregiverUrl}/reviewstats/${route.params.caregiverEmail}`)
      .then(response => {
        setReviewStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching review stats:', error);
      });



  }, [route.params.caregiverEmail]);

  return (
    <ScrollView>
      {caregiver && (
        <View>
            < Image style={styles.imgStyle} 
      
      source={ {uri: imagesUrl + caregiver.profile_picture_url} }
      onError={() => {
        // If the image fails to load, display the placeholder image
        setImage(require('../img/placeholder_img.png'));
      }}
      
      />

          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 5, color: 'grey'}}>
            {caregiver.fullname}
          </Text>
         
          <View style={{ alignItems: 'center', marginTop: 5 }}>
      <Rating stars={reviewStats?.average_rating || 0} maxStars={5} size={24} />
      <Text style={{color: 'grey'}}>({reviewStats?.total_ratings || 0} ratings)</Text>
    </View>
          {/* Display other profile information as needed */}
     </View>
      )}

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginLeft: 10, color: 'grey' }}>Recent Reviews</Text>
      {reviews.map((review, index) => (
        <View key={index} style={{ 
          
          backgroundColor: '#E5E5E5', 
          padding: 15, 
          margin: 10,
          borderRadius: 10 
        
        
      }}>
          <Text>
            <Rating stars={review.caregiver_rating} maxStars={5} size={16} />
            {'  '}
            By {review.user_email} on {review.created_at}
          </Text>
          <Text style={{color: 'grey'}}>{review.review_comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    cardStyle: {
      alignItems: 'center',
      height: '100%',
      borderRadius: 30,
      backgroundColor: 'white',
     
    },
    imgStyle: {
      height: 400,
      width: 400,
      borderRadius: 30,
      alignSelf: 'center',
    }, 
});


export default ProfileScreenCaregiver;
