import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  ImageBackground// Import Image component from react-native
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import { LinearGradient } from "expo-linear-gradient";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");
  const [orders, setOrders] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const navigation = useNavigation();

  const handleEditPress = () => {
    navigation.navigate("UserProfileForm", { userProfile });
  };

  const handleOrderPress = (order) => {
    navigation.navigate("OrderDetails", { order });
  };

  const handleCalendarPress = (calendar) => {
    navigation.navigate("CalendarDetails", { calendar });
  };

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate("Login");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}orders`)
        .then((response) => {
          const userOrders = response.data.filter(
            (order) =>
              order.user &&
              order.user.id === context.stateUser.user.userId
          );

          setOrders(userOrders || []);
        })
        .catch((error) => console.log(error));

        axios
        .get(`${baseURL}calendars`)
        .then((response) => {
          const userCalendars = response.data.filter(
            (calendar) =>
            calendar.user &&
            calendar.user.id === context.stateUser.user.userId
          );

          setCalendars(userCalendars || []);
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile("");
        setOrders([]);
        setCalendars([]);
      };
    }, [context.stateUser.isAuthenticated])
  );
  return (

    <View style={styles.container}>
      <LinearGradient
        colors={["#FFD6D6", "#FFF"]}
      >

        {userProfile && userProfile.image ? (

          <Image
            source={{ uri: userProfile.image }} // Set the source to the user's image URL
            style={styles.userImage} // Define the styles for the image
          />


        ) : null}
        <Text style={styles.headerText}>
          {userProfile ? userProfile.name : ""}
        </Text>
        <View style={styles.userInfoContainer}>

          <Text style={styles.userInfoText}>
            Email: {userProfile ? userProfile.email : ""}
          </Text>
          <Text style={styles.userInfoText}>
            Phone: {userProfile ? userProfile.phone : ""}
          </Text>
          <Text style={styles.userInfoText}>
            Street: {userProfile ? userProfile.street : ""}
          </Text>
          <Text style={styles.userInfoText}>
            Apartment: {userProfile ? userProfile.apartment : ""}
          </Text>
          <Text style={styles.userInfoText}>
            Zip: {userProfile ? userProfile.zip : ""}
          </Text>
          <Text style={styles.userInfoText}>
            City: {userProfile ? userProfile.city : ""}
          </Text>
          <Text style={styles.userInfoText}>
            Country: {userProfile ? userProfile.country : ""}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleEditPress}
            style={[styles.buttonEdit, styles.customButton]}
          >
            <Text style={{ color: "black", fontStyle: "italic", textTransform: 'uppercase', fontWeight: "bold" }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => [
              AsyncStorage.removeItem("jwt"),
              logoutUser(context.dispatch),
            ]}
            style={styles.customButton}
          >
            <Text style={{ color: "black", fontStyle: "italic", textTransform: 'uppercase', fontWeight: "bold" }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ImageBackground
        source={require('../../assets/cart.png')} // Update with the path to your background image
        style={{ flex: 1 }}
        resizeMode="cover"
      >


        <ScrollView contentContainerStyle={styles.contentContainer}>

          {/* Displaying the user's image */}


          <View style={styles.orderContainer}>
            <Text style={{ ...styles.orderHeaderText, backgroundColor: 'rgba(255, 255, 255, .9)' }}>MY ORDERS</Text>
            <View style={{ ...styles.ordersList, backgroundColor: 'rgba(255, 255, 255, .85)' }}>
              {orders && orders.length > 0 ? (
                orders.map((order, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.orderItem}
                    onPress={() => handleOrderPress(order)}
                  >
                    <Text style={styles.orderItemText}>
                      Order ID: {order.id}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noOrderContainer}>
                  <Text>You have no orders</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.orderContainer}>
            <Text style={{ ...styles.orderHeaderText, backgroundColor: 'rgba(255, 255, 255, .9)' }}>My Appointments</Text>
            <View style={{ ...styles.ordersList, backgroundColor: 'rgba(255, 255, 255, .85)' }}>
              {calendars && calendars.length > 0 ? (
                calendars.map((calendar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.orderItem}
                    onPress={() => handleCalendarPress(calendar)}
                  >
                    <Text style={styles.orderItemText}>
                      Appointment ID: {calendar.id}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noOrderContainer}>
                  <Text>You have no orders</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
   

  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 2,
  },
  headerText: {
    fontSize: 14,
    marginTop: 18,
    marginLeft: 18,
    textAlign: "flex-start",
    fontWeight: "bold",
    color: "black",
    textTransform: 'uppercase',
    fontStyle: "italic",

  },
  userInfoContainer: {
    marginVertical: 18,
    padding: 6,
    paddingLeft:20,
    paddingRight:20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    position: "absolute",
    alignSelf: "flex-end",
    right: 18
  },
  userInfoText: {
    marginBottom: 5,
    fontSize: 10,
    color: "black",
    textTransform: 'uppercase',
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "space-between",
    margin: 50,

  },
  customButton: {
    backgroundColor: 'pink',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    elevation: 15,
    color: "black",
  },

  orderContainer: {
    marginBottom: 20,
  },
  orderHeaderText: {
    fontSize: 25,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    fontStyle: "italic",
    backgroundColor: "white",
    width: 200,
    marginLeft: 75,
    marginTop: 20,
    elevation: 5,
    borderRadius:45,

  },
  ordersList: {
    backgroundColor: "#fff",
    borderRadius: 1,
    paddingVertical: 1,
  },
  orderItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  orderItemText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "black",

  },
  noOrderContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  // Style for the user image
  userImage: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginTop: 25,
    // alignSelf: "flex-start",
    marginLeft: 30,
    

  },

});

export default UserProfile;
