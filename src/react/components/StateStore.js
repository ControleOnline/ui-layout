import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import globalStyles from '@controleonline/ui-layout/src/react/styles/global';
import {useStore, useStores} from '@store';

const StateStore = ({store, stores = []}) => {
  const allStores = useStores(state => state);
  const themeStore = useStore('theme') || {};
  const themeGetters = themeStore?.getters || {};
  const {colors = {primary: '#000'}} = themeGetters;
  const styles = globalStyles();

  const storeNames = [
    ...(Array.isArray(store) ? store : store ? [store] : []),
    ...(Array.isArray(stores) ? stores : []),
  ].filter(Boolean);

  const entries = storeNames
    .map(storeName => {
      const currentStore = allStores?.[storeName] || {};
      const getters = currentStore?.getters || {};

      return {
        storeName,
        isLoading: getters.isLoading === true,
        isSaving: getters.isSaving === true,
      };
    })
    .filter(entry => entry.isLoading || entry.isSaving);

  const loadingEntries = entries.filter(entry => entry.isLoading);
  const savingEntries = entries.filter(entry => entry.isSaving);

  if (loadingEntries.length > 0 || savingEntries.length > 0)
    return (
      <View style={styles.state.container}>
        <View style={[styles.state.content, styles.state.loadingContainer]}>
          <ActivityIndicator size="large" color={colors['primary']} />
          {loadingEntries.length > 0 && (
            <Text style={styles.state.errorText}>
              Carregando: {loadingEntries.map(entry => entry.storeName).join(', ')}
            </Text>
          )}
          {savingEntries.length > 0 && (
            <Text style={styles.state.errorText}>
              Salvando: {savingEntries.map(entry => entry.storeName).join(', ')}
            </Text>
          )}
        </View>
      </View>
    );

  return null;
};

export default StateStore;
