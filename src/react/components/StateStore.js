import React from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
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
      const actions = currentStore?.actions || {};

      return {
        storeName,
        actions,
        error: getters.error ?? null,
        isLoading: getters.isLoading === true,
        isSaving: getters.isSaving === true,
      };
    })
    .filter(entry => entry.isLoading || entry.isSaving || entry.error);

  const renderError = () => {
    return entries
      .filter(entry => entry.error)
      .map(entry => {
        const {error} = entry;

        if (Array.isArray(error)) {
          return `${entry.storeName}: ${error.join(', ')}`;
        }

        if (typeof error === 'object') {
          return `${entry.storeName}: ${JSON.stringify(error, null, 2)}`;
        }

        return `${entry.storeName}: ${error}`;
      })
      .join('\n\n');
  };

  const loadingEntries = entries.filter(entry => entry.isLoading);
  const savingEntries = entries.filter(entry => entry.isSaving);
  const hasError = entries.some(entry => entry.error);

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

  if (hasError)
    return (
      <View style={styles.state.container}>
        <View style={[styles.state.content, styles.state.errorContainer]}>
          <Text style={styles.state.errorText}>{renderError()}</Text>
          {entries
            .filter(entry => entry.error)
            .map(entry => (
              <TouchableOpacity
                key={entry.storeName}
                style={styles.button}
                onPress={() => entry.actions?.setError?.(null)}>
                <Text style={styles.buttonText}>
                  Limpar {entry.storeName}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );

  return null;
};

export default StateStore;
