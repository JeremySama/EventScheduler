import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { ScrollView } from "react-native-gesture-handler";

const statusCodes = [
  { name: "Pending", code: "3" },
  { name: "Shipped", code: "2" },
  { name: "Delivered", code: "1" },
];

const OrderDetails = ({ route }) => {
  const { order } = route.params;
  const [orderItems, setOrderItems] = useState([]);

  const findStatusName = (statusCode) => {
    const foundStatus = statusCodes.find((status) => status.code === statusCode);
    return foundStatus ? foundStatus.name : "Unknown";
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await axios.get(`${baseURL}orders/orderItems/${order.id}`);
        setOrderItems(response.data);
      } catch (error) {
        console.error("Error fetching order items:", error);
      }
    };

    fetchOrderItems();
  }, [order.id]);

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Order ID:</Text>
        <Text>{order.id}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Recipient Name:</Text>
        <Text>{`${order.recipient}`}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Shipping Address:</Text>
        <Text>{`${order.shippingAddress}, ${order.city}, ${order.zip}`}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text>{order.phone}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Payment Method:</Text>
        <Text>{order.paymentMethod}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text>{findStatusName(order.status)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Order Date:</Text>
        <Text>{formatDate(order.dateOrdered)}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Price:</Text>
        <Text style={styles.totalLabel2}> ₱ {order.totalPrice}</Text>
      </View>
      <View style={styles.detailsContainer}>
  <Text style={styles.label}>Order Items:</Text>
  <View style={styles.space}>
    {orderItems.map((orderItem) => (
      <View key={orderItem._id} style={styles.orderItemContainer}>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletText}>{'\u2022'}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.label}>{orderItem.product.name}</Text>
            <Text>Price: ₱{orderItem.product.price}, Quantity: {orderItem.quantity}</Text>
          </View>
        </View>
        <Image
          source={{ uri: orderItem.product.image }}
          style={styles.productImage}
        />
      </View>
    ))}
  </View>
</View>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailsContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
  },
  text: {
    color: "#333", 
  },
  space: {
    marginTop: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 40,
    marginRight: 8,
  },
  itemDetails: {
    marginLeft: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
  },

  totalContainer: {
    marginTop: 1,
    marginBottom: 10,
  },
  totalLabel: {
    fontWeight: "bold",
    color: 'red',
    fontSize: 20
  },
  totalLabel2: {
    fontWeight: "bold",
    color: 'black',
    fontSize: 17
  },
});

export default OrderDetails;
