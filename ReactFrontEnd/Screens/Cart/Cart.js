import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,

} from 'react-native';
import {Toast} from "native-base";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearCart, removeFromCart, updateCartItemQuantity } from '../../Redux/Actions/cartActions';
import { Text, Box, HStack, Avatar, VStack, Spacer, Button } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import EasyButton from '../../Shared/StyledComponents/EasyButtons';
import AuthGlobal from "../../Context/Store/AuthGlobal";

var { height, width } = Dimensions.get('window');


const Cart = (props) => {
  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((cart) => {
      total += cart.price * cart.quantity;
    });
    return total.toFixed(2);
  };

  const checkout = () =>{
    if (context.stateUser.isAuthenticated) {
      navigation.navigate('Checkout')
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }
  }

  const increaseQuantity = (item) => {
    dispatch(updateCartItemQuantity(item.id, item.quantity + 1));
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartItemQuantity(item.id, item.quantity - 1));
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => console.log('You touched me')}
      _dark={{
        bg: 'coolGray.800',
      }}
      _light={{
        bg: 'white',
      }}
    >
      <Box pl="4" pr="5" py="2" bg="white">
        <HStack alignItems="center" space={3}>
          <Avatar
            size="48px"
            source={{
              uri: item.image
                ? item.image
                : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png',
            }}
          />
          <VStack>
            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>
              {item.name}
            </Text>
          </VStack>
          <Spacer />
          <Text
            fontSize="xs"
            color="coolGray.800"
            _dark={{
              color: 'warmGray.50',
            }}
            alignSelf="flex-start"
          >
            ₱ {item.price}
          </Text>
          <Button
            size="sm"
            colorScheme="red" 
            onPress={() => decreaseQuantity(item)}
          >
            <Text>-</Text>
          </Button>
          <Text>{item.quantity}</Text>
          <Button
            size="sm"
            colorScheme="blue" 
            onPress={() => increaseQuantity(item)}
          >
            <Text>+</Text>
          </Button>
        </HStack>
      </Box>
    </TouchableOpacity>
  );

  const renderHiddenItem = (cartItems) => (
    <TouchableOpacity onPress={() => dispatch(removeFromCart(cartItems.item))}>
      <VStack alignItems="center" style={styles.hiddenButton} >
                <View>
                    <Icon name="trash" color={"white"} size={30} bg="red" />
                    <Text color="white" fontSize="xs" fontWeight="medium">
                        Delete
                    </Text>
                </View>
            </VStack>
    </TouchableOpacity>
  );

  return (
    <>
      {cartItems.length > 0 ? (
        <Box bg="white" safeArea flex="1" width="100%">
          <SwipeListView
            data={cartItems}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe={true}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewOpenValue={-100}
            previewOpenDelay={3000}
          />
        </Box>
      ) : (
        <Box style={styles.emptyContainer}>
          <Text>No items in cart</Text>
        </Box>
      )}
      <VStack style={styles.bottomContainer} w="100%" justifyContent="space-between">
        <HStack justifyContent="space-between">
          <Text style={styles.price}>₱ {calculateTotal()}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <EasyButton danger medium alignItems="center" onPress={() => dispatch(clearCart())}>
            <Text style={{ color: 'white' }}>Clear</Text>
          </EasyButton>
        </HStack>
        <HStack justifyContent="space-between">
          <EasyButton
            secondary
            medium
            onPress={() => checkout()}
          >
            <Text style={{ color: 'white' }}>Checkout</Text>
          </EasyButton>
        </HStack>
      </VStack>
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
    elevation: 20,
  },
  price: {
    fontSize: 18,
    margin: 20,
    color: 'red',
  },
  hiddenButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 50,
    height: 70,
    width: width / 1,
  },
});

export default Cart;
