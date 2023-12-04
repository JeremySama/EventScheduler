import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import { Center, Heading, Box } from "native-base";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";

const SingleCalendarEvent = (props) => {
  const [event, setEvent] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");

  useEffect(() => {
    if (event.status === 'approved') {
      setAvailability(<TrafficLight available />);
      setAvailabilityText("Approved");
    } else if (event.status === 'pending') {
      setAvailability(<TrafficLight limited />);
      setAvailabilityText("Pending");
    } else {
      setAvailability(<TrafficLight unavailable />);
      setAvailabilityText("Denied");
    }

    return () => {
      setAvailability(null);
      setAvailabilityText("");
    };
  }, []);

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
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/Logo.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.contentContainer}>
        <Heading style={styles.contentHeader} size="xl">
          {event.title}
        </Heading>
        <Text style={styles.contentText}>{event.description}</Text>
      </View>
      <View style={styles.availabilityContainer}>
        <View style={styles.availability}>
          <Text style={styles.availabilityText}>
            Status: {availabilityText}
          </Text>
          {availability}
        </View>
        <Text style={styles.eventInfo}>Location: {event.location}</Text>
        <Text style={styles.eventInfo}>Start: {formatDate(event.startDateTime)}</Text>
        <Text style={styles.eventInfo}>End: {formatDate(event.endDateTime)}</Text>
        <Text style={styles.eventInfo}>
          Attendees: {event.attendees.join(", ")}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 100,
  },
  contentContainer: {
    marginBottom: 20,
  },
  contentHeader: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  contentText: {
    fontSize: 18,
    color: "#666",
  },
  availabilityContainer: {
    marginBottom: 20,
  },
  availability: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  availabilityText: {
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  eventInfo: {
    fontSize: 16,
    color: "#555",
  },
});

export default SingleCalendarEvent;
