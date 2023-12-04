import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AuthGlobal from "../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { LinearGradient } from "expo-linear-gradient";

const Header = () => {
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.isAuthenticated) {
          const response = await axios.get(`${baseURL}users/${stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    setCurrentDate(new Date().toDateString());
  }, [stateUser.isAuthenticated, stateUser.user.userId]);

  const welcomeMessage = userProfile
    ? `Welcome, \n${userProfile.name}`
    : "Welcome to TUPT - Event Scheduler";

  return (
    <LinearGradient
      colors={["#E77979", "#FFD6D6"]}
      style={styles.header}
    >
      <Image
        source={require("../assets/tup.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View>
        <Text style={styles.headerText}>
          {stateUser.isAuthenticated ? welcomeMessage : "Welcome to\nTUPT - Event Scheduler"}
        </Text>
        <Text style={styles.innerText}>
          {currentDate}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 35,
    borderTopLeftRadius: 56,
   borderTopRightRadius:0,
    elevation:20
  },
  headerText: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: 'Cochin',
    fontStyle: "italic",
    marginRight: 80,
  },
  logo: {
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 10,
  },
  innerText: {
    fontColor: "red",
    fontSize: 11,
    alignSelf: "center",
    marginRight: 80,
  },
});


export default Header;
