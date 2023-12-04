import React from "react";
import { TouchableOpacity, View, Dimensions,ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProductCard from "./ProductCard";
var { width } = Dimensions.get("window")
import { LinearGradient } from "expo-linear-gradient";

const ProductList = (props) => {
    const { item } = props;
    const navigation = useNavigation();

    return (
      
        <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => navigation.navigate("Product Detail", { item: item })
            }

        >
            
            <View style={{ width: width / 2, backgroundColor: '#F8F9F5' }}>
                <ProductCard {...item} />
            </View>

            
           
        </TouchableOpacity>
     
    )
}
export default ProductList;