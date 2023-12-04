import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Container,
  Button,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Input, VStack, Heading, Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import ListItem from "./CalendarListItem";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Title</Text>
      </View>
        <Text style={{ fontWeight: "600" }}>         </Text>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Start Date</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>         </Text>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>End Date</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>         </Text>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Status</Text>
      </View>
    </View>
  );
};

const Calendars = (props) => {
  const [calendarList, setCalendarList] = useState();
  const [calendarFilter, setCalendarFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const searchCalendar = (text) => {
    if (text === "") {
      setCalendarFilter(calendarList);
    }
    setCalendarFilter(
      calendarList.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteCalendar = (id) => {
    axios
      .delete(`${baseURL}calendars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const calendars = calendarFilter.filter((item) => item.id !== id);
        setCalendarFilter(calendars);
      })
      .catch((error) => console.log(error));
  };



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}calendars`).then((res) => {
        setCalendarList(res.data);
        setCalendarFilter(res.data);
        setLoading(false);
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Get Token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}calendars`).then((res) => {
        setCalendarList(res.data);
        setCalendarFilter(res.data);
        setLoading(false);
      });

      return () => {
        setCalendarList();
        setCalendarFilter();
        setLoading(true);
      };
    }, [])
  );

  const filterByStatus = (status) => {
    setStatusFilter(status); // Update the statusFilter state
  
    if (status === "All") {
      setCalendarFilter(calendarList);
    } else {
      const filteredCalendars = calendarList.filter(
        (item) => item.status === status
      );
      setCalendarFilter(filteredCalendars);
    }
  };

  return (
    <Box flex={1}>
      <View>
      <ScrollView horizontal={true} style={styles.buttonContainer}>
      <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Orders")}
          >
            <Icon name="shopping-bag" size={18} color="white" />
            <Text style={styles.buttonText}>Orders</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("CalendarForm")}
          >
            <Icon name="plus" size={15} color="white" />
            <Text style={styles.buttonText}>Calendar</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Products")}
          >
            <Icon name="shopping-cart" size={18} color="white" />
            <Text style={styles.buttonText}>Product</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Users")}
          >
            <Icon name="calendar" size={18} color="white" />
            <Text style={styles.buttonText}>User</Text>
          </EasyButton>
      </ScrollView>
      </View>
      <Searchbar
        width="80%"
        placeholder="Search"
        onChangeText={(text) => searchCalendar(text)}
      />
      <Picker
          selectedValue={statusFilter}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => filterByStatus(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Approved" value="approved" />
          <Picker.Item label="Denied" value="denied" />
          <Picker.Item label="Pending" value="pending" />
        </Picker>
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={calendarFilter}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <ListItem item={item} index={index} deleteCalendar={deleteCalendar} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 160,
    backgroundColor: "white",
  },
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
  },
});

export default Calendars;
