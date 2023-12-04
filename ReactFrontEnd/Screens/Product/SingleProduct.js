import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  ToastAndroid,
} from "react-native";
import {
  Box,
  HStack,
  Container,
  H1,
  Center,
  Heading,
  Button,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import CartIcon from "../../Shared/CartIcon";
import Toast from "react-native-toast-message";
import * as actions from "../../Redux/Actions/cartActions";
import { useSelector, useDispatch } from "react-redux";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { Rating, AirbnbRating } from "react-native-ratings";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [userReview, setUserReview] = useState({
    comment: "",
    rating: 5, // Default rating
  });
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");
  const { stateUser } = useContext(AuthGlobal);
  const navigation = useNavigation()

  const roundedRating = Math.round(item.ratings * 10) / 10;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.isAuthenticated) {
          const response = await axios.get(
            `${baseURL}users/${stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [stateUser.isAuthenticated, stateUser.user.userId]);

  const handleReviewSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");

      // Check if the user is authenticated or if the token exists
      if (!token || !stateUser.isAuthenticated) {
        navigation.navigate("User", { screen: "Login" });
        return; // Stop execution here
      }
      // Validate the comment input
      if (!userReview.comment.trim()) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please provide a comment",
        });
        return;
      }

      const reviewData = {
        comment: userReview.comment,
        rating: userReview.rating,
        user: {
          _id: stateUser.user.userId, // Assuming the user ID is available in stateUser
          name: userProfile.name,
        },
      };

      const response = await axios.put(
        `${baseURL}products/createReviews/${item._id}`,
        reviewData
      );

      navigation.goBack(); // Handle success or update the UI accordingly after submitting the review
      console.log("Review submitted:", response.data);
    } catch (error) {
      // Handle errors here
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    if (item.countInStock == 0) {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailabilityText("Unvailable");
    } else if (item.countInStock <= 5) {
      setAvailability(<TrafficLight limited></TrafficLight>);
      setAvailabilityText("Limited Stock");
    } else {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailabilityText("Available");
    }

    return () => {
      setAvailability(null);
      setAvailabilityText("");
    };
  }, []);

  return (
    <Center flexGrow={1} style={{ backgroundColor: "white", }}>
      <LinearGradient
        colors={["#FFD6D6", "#FFF"]}
      >
      <ScrollView style={{ marginBottom: 80, padding: 5 }}>
        <View style={{ borderBottomEndRadius: 56, borderBottomLeftRadius: 56 }} >
          <Image
            source={{
              uri: item.image
                ? item.image
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
            resizeMode="contain"
            style={{ ...styles.image, borderBottomEndRadius: 56 }}
          />

        </View>

        <View style={styles.contentContainer}>
          <Heading style={styles.contentHeader} size="xl">
            {item.name}
          </Heading>
          <View style={styles.availability}>
            <Text style={{ marginRight: 5, fontStyle: "italic", fontSize: 12, }}>
              {availabilityText}  {availability}
            </Text>
          </View>
          <Text style={styles.contentText}>Brand: {item.brand}</Text>
        </View>
        <View >
          <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Description: {item.description}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <Text style={{ marginBottom:25 }}>Stock: {item.countInStock}</Text>
          <Text style={{fontSize:18, fontStyle:"italic"   }}>Product Review  </Text>
          <Text style={{ postion: 'absolute',left:100,top:2}}> {Number.isInteger(roundedRating) ? roundedRating : roundedRating.toFixed(1)}/5 </Text>
          <Text style={{ postion: 'absolute', top:-18,  }}><Rating
            type="star"
            startingValue={item.ratings}
            imageSize={20}
            readonly

          /></Text>
          
          
          {item.reviews === null ? null : (
            <View>
              {item.reviews.map((review) => (
                <View>
                  <Image
                    source={{
                      uri: item.image
                        ? item.image
                        : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
                    }}
                    style={{ width: 30, height: 30 }}
                    className="rounded"
                  />
                  <View style={styles.lineBreak} />
                  <View style={styles.reviewContainer}>
                 
                    <Text style={styles.reviewUserName}>Name: {review.name}</Text>
                    <Rating
                      type="star"
                      startingValue={review.rating}
                      imageSize={13}
                      readonly
                      style={{...styles.reviewRating, backgroundColor:"pink"}}
                    />

                    <View>
                     <Text >Comment: {review.comment}</Text>
                    </View>
                  
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={styles.productReviewContainer}>

          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={userReview.rating}
              size={30}
              showRating={false}
              onFinishRating={(rating) =>
                setUserReview({ ...userReview, rating })
              }

            />
            <Text style={styles.ratingText}>Rate it</Text>
            <Text style={styles.reviewHeaderText}>Make a Comment</Text>
            <TextInput
              placeholder="Your comment..."
              style={styles.reviewInput}
              value={userReview.comment}
              onChangeText={(text) =>
                setUserReview({ ...userReview, comment: text })
              }
            />

          </View> 
          <EasyButton
            primary
            large
            onPress={handleReviewSubmit}
            style={styles.submitReviewButton}
          >
            <Text style={styles.submitReviewText}>Submit Review</Text>
          </EasyButton>
        </View>
      </ScrollView>
      </LinearGradient>
      <View style={styles.bottomContainer}>
        <HStack space={3} justifyContent="center">
          <Text style={styles.price}>₱ {item.price}</Text>
          <EasyButton
            primary
            medium
            onPress={() => {
              dispatch(actions.addToCart({ ...item, quantity: 1 }));
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: `${item.name} added to Cart`,
                text2: "Go to your cart to complete order",
              });
            }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add to Cart </Text>
            <Text style={styles.addIconText}>
              <>
              <CartIcon />
              
              <Icon
                name="shopping-cart"
                style={{ position: "relative"}}
                size={25}

              />

            </></Text>
            
          </EasyButton>
        </HStack>
      </View>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",

    //
  },

  reviewUserName:{
    fontSize:14,
    fontWeight:"bold"

  },
  imageContainer: {
    backgroundColor: "white",
    padding: 0,
    margin: 0,

  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.3,
    backgroundColor: "#CCCCCC",
    borderBottomRightRadius: 20, borderBottomLeftRadius: 20


  },
  contentContainer: {
    marginTop: 1,
    // justifyContent: "center",


  },
  contentHeader: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 24,


  },

  contentText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,

  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 70,
   
  },
  price: {
    fontSize: 20,
    margin: 20,
    color: "red",
    fontWeight: "bold",
    marginRight:2

  },
  availabilityContainer: {
    marginBottom: 20,



  },
  productReviewContainer: {
    marginTop: 30,
  },

  availability: {
    marginLeft: 150

  },
  addButton: {
    backgroundColor: "#1260CC",
    borderRadius: 5,
    paddingHorizontal: 0,
    paddingVertical: 0,

  },
  addButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textTransform:'uppercase',

  },
  addIconText: {
    color: "white",
    position:'absolute',
    top:25,
    left:35

  },

  ratingText: {
  fontSize: 20,
  marginLeft:145,
  fontStyle:'italic',
  fontWeight:"bold"

  },
  reviewContainer:{
    alignItems:"flex-start"
  },



  // ratingContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // ratingText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginRight: 10,
  // },
  // reviewContainer: {
  //   marginLeft: 40,
  // },
  // reviewUserName: {
  //   fontWeight: 'bold',
  // },
  // reviewRating: {
  //   marginTop: 5,
  // },
  // reviewComment: {
  //   marginTop: 5,
  // },
  lineBreak: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 1,
  },
});

export default SingleProduct;
