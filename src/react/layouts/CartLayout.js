import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';

const CartLayout = ({children, navigation, route}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.content]}>{children}</View>
      <BottomCart navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1},
});

export default CartLayout;
