import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button} from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import { Picker } from "@react-native-picker/picker";

const CalendarFormUpdate = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("pending"); // Added status state
  const [location, setLocation] = useState("Gymnasium"); // Added location state

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [datePickerType, setDatePickerType] = useState("");
  const context = useContext(AuthGlobal);
  let navigation = useNavigation();

  useEffect(() => {
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
  }, []);

  const showDatePicker = (type) => {
    setDatePickerType(type);
    if (type === "start") {
      setStartDatePickerVisibility(true);
    } else if (type === "end") {
      setEndDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString();

    if (datePickerType === "start") {
      setStartDateTime(formattedDate);
    } else if (datePickerType === "end") {
      setEndDateTime(formattedDate);
    }
    hideDatePicker();
  };

  useEffect(() => {
    if (!props.route.params) {
      setEvent(null);
    } else {
      setEvent(props.route.params.event);
      setTitle(props.route.params.event.title);
      setDescription(props.route.params.event.description);
      setStartDateTime(props.route.params.event.startDateTime);
      setEndDateTime(props.route.params.event.endDateTime);
      setAttendees(props.route.params.event.attendees.join(", "));
      setLocation(props.route.params.event.location);
      setStatus(props.route.params.event.status); // Set the status from the event data
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const addOrUpdateEvent = () => {
    if (
      title === "" ||
      description === "" ||
      startDateTime === "" ||
      endDateTime === "" ||
      attendees === ""
    ) {
      setError("Please fill in the form correctly");
      return;
    }

    const eventData = {
      title,
      description,
      startDateTime,
      endDateTime,
      status, // Add the status field to the eventData object
      attendees: attendees.split(",").map((item) => item.trim()),
      user,
      location, // Include the selected location in the eventData object
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (event !== null) {
      axios
        .put(`${baseURL}calendars/${event.id}`, eventData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Event successfully updated",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Calendars");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      axios
        .post(`${baseURL}calendars`, eventData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Event added",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Calendars");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };

  return (
    <FormContainer title="Add Event">
      <Text style={styles.label}>Title</Text>
      <Input
        placeholder="Title"
        name="title"
        id="title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Text style={styles.label}>Description</Text>
      <Input
        placeholder="Description"
        name="description"
        id="description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Text style={styles.label}>Start Date and Time</Text>
      <Button title="Select Start Date" onPress={() => showDatePicker("start")} />
      <Text>
        {startDateTime ? new Date(startDateTime).toLocaleString() : ""}
      </Text>
      <Text style={styles.label}>End Date and Time</Text>
      <Button title="Select End Date" onPress={() => showDatePicker("end")} />
      <Text>{endDateTime ? new Date(endDateTime).toLocaleString() : ""}</Text>
      <Text style={styles.label}>Attendees (comma-separated)</Text>
      <Input
        placeholder="Attendees"
        name="attendees"
        id="attendees"
        value={attendees}
        onChangeText={(text) => setAttendees(text)}
      />
      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="Approved" value="approved" />
        <Picker.Item label="Denied" value="denied" />
      </Picker>
      <Text style={styles.label}>Location</Text>
      <Picker
        selectedValue={location}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue) => setLocation(itemValue)}
      >
        <Picker.Item label="Gymnasium" value="Gymnasium" />
        <Picker.Item label="Function Hall" value="Function Hall" />
        <Picker.Item label="Multipurpose Hall" value="Multipurpose Hall" />
      </Picker>
      {error ? <Text>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addOrUpdateEvent()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible || isEndDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
  },
});

export default CalendarFormUpdate;
