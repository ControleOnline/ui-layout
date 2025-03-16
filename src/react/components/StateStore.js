import React from 'react';
import globalStyles from '@controleonline/ui-shop/src/react/styles/global';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {getStore} from '@store';

const StateStore = ({store}) => {
  const {getters} = getStore(store);
  const {item, items, isLoading, error} = getters;
  const {getters: themeGetters} = getStore('theme');
  const {colors} = themeGetters;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
    },
  });

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={[styles.content, globalStyles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors['primary']} />
        </View>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <View style={[styles.content, globalStyles.loadingContainer]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );

  if (!item && (!items || items.length == 0))
    return (
      <View style={styles.container}>
        <View style={[styles.content, globalStyles.loadingContainer]}>
          <Text style={styles.errorText}>Não encontrado</Text>
        </View>
      </View>
    );
};

export default StateStore;
