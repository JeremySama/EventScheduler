import React, { useState, useEffect, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import { Container, Icon, Input, VStack, Center, Toast } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import CalendarList from "./CalendarList";
import SearchedCalendar from "./SearchedCalendar";
import Banner from "../../Shared/Banner";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Icons from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { LinearGradient } from "expo-linear-gradient";
var { width, height } = Dimensions.get("window");

const CalendarContainer = () => {
  const [calendars, setCalendars] = useState([]);
  const [calendarsFiltered, setCalendarsFiltered] = useState([]);
  const [focus, setFocus] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const searchCalendar = (text) => {
    setCalendarsFiltered(
      calendars.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };
  const formDatas = () => {
    if (context.stateUser.isAuthenticated) {
      navigation.navigate("FormEvent")
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to proceed",
        text2: "",
      });
    }
  }
  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setSelectedDate(date);
  };

  const resetAndFetchAllCalendars = () => {
    setSelectedDate(null);

    // Fetch all calendars again
    axios.get(`${baseURL}calendars`)
      .then((res) => {
        setCalendars(res.data);
        setCalendarsFiltered(res.data.filter((calendar) => calendar.status === "approved"));
        setLoading(false);
      })
      .catch((error) => {
        console.log("API call error", error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);

      // Calendars
      axios
        .get(`${baseURL}calendars`)
        .then((res) => {
          setCalendars(res.data);
          setCalendarsFiltered(res.data.filter((calendar) => calendar.status === 'approved'));
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("API call error");
        });

      return () => {
        setCalendars([]);
        setCalendarsFiltered([]);
        setFocus();
        setInitialState();
      };
    }, [])
  );

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate);
      formattedDate.setHours(0, 0, 0, 0); // Normalize time to midnight
  
      const filteredCalendars = calendars.filter((calendar) => {
        const calendarDate = new Date(calendar.startDateTime);
        calendarDate.setHours(0, 0, 0, 0); // Normalize time to midnight
  
        return (
          calendarDate.getTime() === formattedDate.getTime() &&
          calendar.status === "approved"
        );
      });
      setCalendarsFiltered(filteredCalendars);
    } else {
      const approvedCalendars = calendars.filter(
        (calendar) => calendar.status === "approved"
      );
      setCalendarsFiltered(approvedCalendars);
    }
  }, [selectedDate, calendars]);

  return (
    <>

      {loading === false ? (
        <Center>
          <LinearGradient
            colors={["#FFD6D6", "#FFF"]}
          >
            <VStack w="97%" space={6} alignSelf="center">
              <Input
                onFocus={openList}
                onChangeText={(text) => searchCalendar(text)}
                placeholder="SEARCH"
                backgroundColor="white"
                variant="filled"
                width="100%"
                borderRadius="10"
                py="1"
                px="2"
                borderColor="black"
                InputLeftElement={
                  <Icon
                    ml="2"
                    size="4"
                    color="black"
                    as={<Ionicons name="ios-search" />}
                  />
                }
                InputRightElement={
                  focus === true ? (
                    <Icon
                      ml="2"
                      size="6"
                      color="black"
                      as={<Ionicons name="close" size="12" color="black" />}
                    />
                  ) : null
                }
              />
            </VStack>
            <View style={styles.buttonContainer}>
              <EasyButton
                secondary
                medium
                onPress={() => formDatas()}
                style={{ backgroundColor: "blue", elevation: 12 }}>
                <Icons name="plus" size={15} color="white" />
                <Text style={styles.buttonText}>Add Event</Text>
              </EasyButton>

              <View style={styles.buttonSpacer} />

              <EasyButton
                secondary
                medium
                onPress={showDatePicker}
                style={{ backgroundColor: "blue", elevation: 12 }}>
                <Icons name="calendar" size={15} color="white" />
                <Text style={styles.buttonText}>Pick a Date</Text>
              </EasyButton>

              <View style={styles.buttonSpacer} />

              <EasyButton
                secondary
                medium
                onPress={resetAndFetchAllCalendars}
                style={{ backgroundColor:"blue", elevation:12 }}
              >
                <Icons name="refresh" size={15} color="white" />
                <Text style={styles.buttonText}>Refresh</Text>
              </EasyButton>
            </View>
          </LinearGradient>
          {focus === true ? (
            <SearchedCalendar calendarsFiltered={calendarsFiltered} />
          ) : (
            <ScrollView style={{ marginBottom: 60 }}>
              <View>
                <Banner />
              </View>
              {calendarsFiltered.length > 0 ? (
                <View style={styles.listContainer}>
                  {calendarsFiltered.map((item) => {
                    return <CalendarList key={item._id.$oid} item={item} />;
                  })}
                </View>
              ) : (
                <View style={[styles.center, { height: height / 2 , backgroundColor: "white"}]}>
                  <Text>No calendars found</Text>
                </View>
              )}
            </ScrollView>
          )}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </Center>
      ) : (
        <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    
  },
  buttonSpacer: {
    width: 1, // Adjust the spacing between buttons as needed

  },
  buttonText: {
    color: 'white',
    marginLeft: 5, // Adjust the spacing between icon and text as needed
    fontStyle: "italic",
    textTransform:'uppercase',
    fontSize:12,
    
  },
  Reset: {
    backgroundColor: 'blue',
    borderRadius: 10,
    elevation: 5
  },
  DatePicker: {

  },
  Reset: {

  },

});

export default CalendarContainer;
