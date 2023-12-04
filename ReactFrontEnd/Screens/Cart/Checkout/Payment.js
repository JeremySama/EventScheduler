import React, { useState } from 'react';
import { View, Text, Button, Select, Icon, Toast, CheckIcon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Payment = (props) => {
  const order = props.route.params;
  const [selected, setSelected] = useState('');
  const navigation = useNavigation();
  const paymentOptions = ['Cash on Delivery', 'GCash'];

  const paydetails = () => {
    let payment = {
      paymentMethod: selected,
    };

    navigation.navigate('Confirm', { order: order, payment: payment });
    console.log(payment, 'the payment');
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1, padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: 'bold' }}>Payment Details</Text>
      <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
        <Text style={{ marginBottom: 10 }}>Payment Method</Text>
        <Select
          placeholder="Select payment method"
          value={selected}
          onValueChange={(value) => setSelected(value)}
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
        >
          {paymentOptions.map((option, index) => (
            <Select.Item key={index} label={option} value={option} />
          ))}
        </Select>
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#EF4444',
            borderRadius: 20,
            paddingVertical: 15,
            alignItems: 'center',
          }}
          onPress={() => paydetails()}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;
