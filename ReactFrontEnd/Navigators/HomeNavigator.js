import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import ProductContainer from '../Screens/Product/ProductContainer'
import SingleProduct from '../Screens/Product/SingleProduct'
import { View } from 'native-base'
const Stack = createStackNavigator()
function MyStack() {
    return (
        
        <Stack.Navigator>
            <Stack.Screen
                name='Home'
                component={ProductContainer}
                options={{
                    headerShown: false,

                }}
            />
            <Stack.Screen 
                name='Product Detail'
                component={SingleProduct}
                options={{
                    title: 'Product Details',
                    headerTitleStyle: {
                        color: 'black', 
                        textTransform: 'uppercase',
                        fontWeight:'bold',
                    },
                
                }}
            
            />

        </Stack.Navigator>
      
    )
}

export default function HomeNavigator() {
    return <MyStack />;
}