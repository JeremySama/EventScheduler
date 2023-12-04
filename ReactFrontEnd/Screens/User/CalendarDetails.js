import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";



const OrderDetails = ({ route }) => {
  const { calendar } = route.params;
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

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Appointment ID:</Text>
        <Text>{calendar.id}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Title:</Text>
        <Text>{`${calendar.title}`}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Purpose:</Text>
        <Text>{`${calendar.description}`}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Location:</Text>
        <Text>{calendar.location}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text>{calendar.status}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Attendees:</Text>
        <Text>{calendar.attendees.join(", ")}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Start Time Date:</Text>
        <Text>{formatDate(calendar.startDateTime)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>End Time Date:</Text>
        <Text>{formatDate(calendar.endDateTime)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Date Created:</Text>
        <Text>{formatDate(calendar.dateCreated)}</Text>
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
