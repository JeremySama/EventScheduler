import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Button,
  ImageBackground,
} from "react-native";
import Toast from "react-native-toast-message";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import { Rating, AirbnbRating } from "react-native-ratings";

var { width } = Dimensions.get("window");

const ProductCard = (props) => {
  const { _id, name, price, image, countInStock, ratings } = props;
  const roundedRating = Math.round(ratings * 10) / 10;
  const dispatch = useDispatch();
  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
    <View style={styles.container}>
      
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: image
            ? image
            : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
        }}
      />
      <View style={styles.card} />
      <Text style={styles.title}>
        {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
      </Text>
      <Text style={styles.price}>₱ {price}</Text>
      {countInStock > 0 ? (
        <View style={{ marginBottom: 60 }}>
          <Button
            title={"Add To Cart"}
            color={"#FF5F1F"}
            onPress={() => {
              dispatch(actions.addToCart({ ...props, quantity: 1 })),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${name} added to Cart`,
                  text2: "Go to your cart to complete order",
                });
            }}
          >
            {" "}
          </Button>
          <Text>Rating: {Number.isInteger(roundedRating) ? roundedRating : roundedRating.toFixed(1)}/5</Text>
          <Rating type="star" startingValue={ratings} imageSize={24} readonly />
        </View>
      ) : (
        <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>
      )}
     
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 250,
    padding: 10,
    borderRadius: 10,
    marginTop: 25,
    marginBottom:55,
    marginLeft: 16,
    marginRight: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
  },
  image: {
    width: width / 2 - 20 - 10,
    height: width / 2 - 20 - 30,
    // width: 300,
    // height: 120,
    backgroundColor: "transparent",
    position: "absolute",
    top: -30,
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 20 - 90,
    backgroundColor: "transparent",
    width: width / 2 - 20 - 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    color: "red",
    marginTop: 10,
  },
});

export default ProductCard;
