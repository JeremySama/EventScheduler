import React, { useEffect, useState, useContext } from "react";
import { Text, View, Button,TouchableOpacity } from "react-native";
import {
  Select,
  Item,
  Picker,
  Toast,
  CheckIcon,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";

const cities = require("../../../assets/countries.json");

const Checkout = (props) => {
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    setOrderItems(cartItems);

    // Calculate total price
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);

    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }
    return () => {
      setOrderItems([]);
    };
  }, [cartItems, context.stateUser.isAuthenticated, navigation]);

  const checkOut = () => {
    let total = 0;
    orderItems.forEach((item) => {
      total += item.price * item.quantity;
    });

    let order = {
      city,
      recipient,
      dateOrdered: Date.now(),
      orderItems,
      phone,
      shippingAddress: address,
      status: "3",
      user,
      zip,
      totalPrice: total,
    };
    navigation.navigate("Payment", { order: order });
  };

  console.log(orderItems);
  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Shipping Address"}>
      <Input
          placeholder={"Recipient Name"}
          name={"recipient"}
          value={recipient}
          onChangeText={(text) => setRecipient(text)}
        />
        <Input
          placeholder={"Phone"}
          name={"phone"}
          value={phone}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Shipping Address"}
          name={"ShippingAddress"}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Input
          placeholder={"Zip Code"}
          name={"zip"}
          value={zip}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
        />
        <Select
          width="80%"
          iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
          style={{ width: undefined }}
          selectedValue={city}
          placeholder="Select your City"
          placeholderStyle={{ color: "#007aff" }}
          placeholderIconColor="#007aff"
          onValueChange={(e) => setCity(e)}
        >
          {cities.map((c) => {
            return <Select.Item key={c.code} label={c.name} value={c.name} />;
          })}
        </Select>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16 }}>Total Price:</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          ₱{totalPrice.toFixed(2)}
          </Text>
        </View>
        
      </FormContainer>
      <View style={{ marginTop: 20, alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: "#EF4444",
              borderRadius: 20,
              paddingVertical: 10,
              alignItems: "center",
              width: 300,
            }}
            onPress={() => checkOut()}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              Confirm
            </Text>
          </TouchableOpacity>
          {/* <Button title="Confirm" onPress={() => checkOut()} /> */}
        </View>
    </KeyboardAwareScrollView>
  );
};
export default Checkout;
