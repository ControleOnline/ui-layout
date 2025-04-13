import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import BottomToolbar from '@controleonline/ui-manager/src/react/components/BottomToolbar';

const ManagerLayout = ({children, navigation, route}) => {
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

export default ManagerLayout;
