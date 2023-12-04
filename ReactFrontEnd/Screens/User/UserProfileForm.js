import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import Error from "../../Shared/Error";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";

const UserProfileForm = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        setToken(token);

        const response = await axios.get(
          `${baseURL}users/${props.route.params?.userProfile?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;

        setName(userData?.name || "");
        setEmail(userData?.email || "");
        setPhone(userData?.phone || "");
        setStreet(userData?.street || "");
        setApartment(userData?.apartment || "");
        setZip(userData?.zip || "");
        setCity(userData?.city || "");
        setCountry(userData?.country || "");
        setMainImage(userData?.image || "");
        setImage(userData?.image || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);

        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });

        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup logic, if needed
    };
  }, [props.route.params?.userProfile?._id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (
        name === "" ||
        email === "" ||
        phone === "" ||
        street === "" ||
        city === "" ||
        country === ""
      ) {
        setError("Please fill in the form correctly");
        return;
      }

      let formData = new FormData();
      const newImageUri = "file:///" + image.split("file:/").join("");

      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("street", street);
      formData.append("apartment", apartment);
      formData.append("zip", zip);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });

      const config = {
        timeout: 5000, // 5 seconds timeout
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const userId = props.route.params?.userProfile?._id;
      console.log("User ID:", userId);

      const apiUrl = `${baseURL}users/${userId}`;
      console.log("API URL:", apiUrl);

      const res = await axios.put(apiUrl, formData, config);

      if (res.status === 200 || res.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Profile updated successfully",
          text2: "",
        });
        setTimeout(() => {
          navigation.navigate("User Profile");
        }, 500);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);

      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer title="Edit Profile">
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.imageContainer}>
            {mainImage !== "" && (
              <Image style={styles.image} source={{ uri: mainImage }} />
            )}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Icon style={{ color: "white" }} name="camera" />
            </TouchableOpacity>
          </View>
          <Input
            placeholder="Name"
            name="name"
            id="name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="Email"
            name="email"
            id="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Phone"
            name="phone"
            id="phone"
            value={phone}
            keyboardType="numeric"
            onChangeText={(text) => setPhone(text)}
          />
          <Input
            placeholder="Street"
            name="street"
            id="street"
            value={street}
            onChangeText={(text) => setStreet(text)}
          />
          <Input
            placeholder="Apartment"
            name="apartment"
            id="apartment"
            value={apartment}
            onChangeText={(text) => setApartment(text)}
          />
          <Input
            placeholder="ZIP"
            name="zip"
            id="zip"
            keyboardType="numeric"
            value={zip}
            onChangeText={(text) => setZip(text)}
          />
          <Input
            placeholder="City"
            name="city"
            id="city"
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <Input
            placeholder="Country"
            name="country"
            id="country"
            value={country}
            onChangeText={(text) => setCountry(text)}
          />

          {error ? <Error message={error} /> : null}
          <View style={styles.buttonContainer}>
            <EasyButton large primary onPress={() => updateUserProfile()}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </EasyButton>
          </View>
        </>
      )}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default UserProfileForm;
