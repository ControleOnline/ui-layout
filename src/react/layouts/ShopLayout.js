import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomToolbar from '../components/BottomToolbar';
import {useTheme} from '@controleonline/ui-layout/src/react/components/ThemeProvider';

const ShopLayout = ({children, navigation, route}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <BottomToolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1},
});

export default ShopLayout;
