import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from '@react-navigation/native';
import { Button } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";


const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation()



  const register = () => {

    if (email === "" || name === "" || phone === "" || password === "") {
      setError("Please fill in the form correctly");
    }

    let user = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      isAdmin: false,
    }
    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please Login into your account",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          position: 'bottom',
          bottomOffset: 20,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  }

  return (

    <ImageBackground
      source={require('../../assets/court.png')} // Update with the path to your background image
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* <Text style={styles.title}>REGISTRATION</Text> */}
      <KeyboardAwareScrollView style={{ ...styles.FormContainer, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      >
       
        <FormContainer  >
       
          <Input
            placeholder={"Email"}
            name={"email"}
            id={"email"}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />
          <Input
            placeholder={"Name"}
            name={"name"}
            id={"name"}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder={"Phone Number"}
            name={"phone"}
            id={"phone"}
            keyboardType={"numeric"}
            onChangeText={(text) => setPhone(text)}
          />
          <Input
            placeholder={"Password"}
            name={"password"}
            id={"password"}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={styles.buttonGroup}>
            {error ? <Error message={error} /> : null}
          </View>
          <View>
            {/* <Button variant={"ghost"} onPress={() => register()}>
            <Text style={{ color: "blue" }}>Register</Text>
          </Button> */}
            <EasyButton large primary onPress={() => register()} style={styles.customButtonRegister}>
              <Text style={{ color: "white", fontStyle: "italic" }}>Register</Text>

            </EasyButton>
          </View>
          <View>
            <EasyButton
              large
              secondary
              onPress={() => navigation.navigate("Login")}
              style={styles.customButtonLogin}
            >
              <Text style={{ color: "white", fontStyle: "italic" }}>Back to Login</Text>
            </EasyButton>
            {/* <Button variant={"ghost"}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "blue" }}>Back to Login</Text>
          </Button> */}
          </View>
        </FormContainer>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    margin: 10,
    alignItems: "center",
  },

  FormContainer: {
    margin: 5,
    marginTop: 10,
    borderRadius: 20,
    borderBottomStartRadius: 56,
    backgroundColor: "white"
   

  },
  customButtonRegister: {
    backgroundColor: 'green',
    borderRadius: 10,
    elevation: 5

  },
  customButtonLogin: {
    backgroundColor: 'blue',
    borderRadius: 10,
    elevation: 5

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
    color: "black",
    position:"absolute",
    top:20,
    left:20,
    backgroundColor:"white",
    borderRadius:5,
    padding:5,
  
    
  },
});

export default Register;