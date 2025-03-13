import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import BottomToolbar from '../components/BottomToolbar';

const ShopLayout = ({children, navigation, route}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.content]}>{children}</View>
      <BottomToolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1},
});

export default ShopLayout;
