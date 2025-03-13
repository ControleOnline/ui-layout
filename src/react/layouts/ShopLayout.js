import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import BottomToolbar from '../components/BottomToolbar';
import {useTheme} from '@controleonline/ui-layout/src/react/components/ThemeProvider';
import globalStyles from '@controleonline/ui-shop/src/react/styles/global';
import {getStore} from '@store';

const ShopLayout = ({children, navigation, route, store}) => {
  const {colors} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  if (store) {
    const {getters, actions} = getStore(store);
    setIsLoading(getters.isLoading);
    setError(getters.error);
    setItem(getters.item);
    setItems(getters.items);
    if (isLoading)
      return (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#3FB8AF" />
        </View>
      );

    if (error)
      return (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#3FB8AF" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );

    if (!item && (!items || items.length == 0))
      return (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#3FB8AF" />
          <Text style={styles.errorText}>Não encontrado</Text>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            display: isLoading || error ? 'none' : 'flex',
          },
        ]}>
        {children}
      </View>
      <BottomToolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1},
});

export default ShopLayout;
