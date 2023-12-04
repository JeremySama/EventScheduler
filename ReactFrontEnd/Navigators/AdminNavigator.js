import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Orders from "../Screens/Admin/Orders"
import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"
import Categories from "../Screens/Admin/Categories"
import Calendars from "../Screens/Admin/Calendars"
import CalendarForm from "../Screens/Admin/CalendarForm"
import CalendarFormUpdate from "../Screens/Admin/CalendarFormUpdate"
import SingleCalendarEvent from '../Screens/Appointment/SingleCalendarEvent'
import Users from '../Screens/Admin/Users'
import UpdateUserStatus from "../Screens/Admin/UpdateUserStatus"
const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Products"
                component={Products}
                options={{
                    title: "Products"
                }}
            
            />
            <Stack.Screen 
                name="Calendars"
                component={Calendars}
                options={{
                    title: "Calendar",
                }}
            />
            <Stack.Screen 
                name="Users"
                component={Users}
                options={{
                    title: "Users",
                }}
            />
            <Stack.Screen 
                name="CalendarForm"
                component={CalendarForm}
                options={{
                    title: "CalendarForm",
                }}
            />
            <Stack.Screen 
                name="CalendarFormUpdate"
                component={CalendarFormUpdate}
                options={{
                    title: "CalendarForm",
                }}
            />
            <Stack.Screen 
                name="UpdateUserStatus"
                component={UpdateUserStatus}
                options={{
                    title: "Update User Status",
                }}
            />
            <Stack.Screen 
                name="SingleCalendarEvent"
                component={SingleCalendarEvent}
                options={{
                    title: "Calendar Event Details",
                }}
            />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="ProductForm" component={ProductForm} />
        </Stack.Navigator>
    )
}
export default function AdminNavigator() {
    return <MyStack />
}