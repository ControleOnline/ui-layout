import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import globalStyles from '@controleonline/ui-layout/src/react/styles/global';
import {getStore} from '@store';

const StateStore = ({store}) => {
  const {getters, actions} = getStore(store);
  const {item, items, isLoading, isSaving, error} = getters;
  const {getters: themeGetters} = getStore('theme');
  const {colors} = themeGetters;
  const styles = globalStyles();

  const renderError = () => {
    if (Array.isArray(error)) return error.join(', ');
    if (typeof error === 'object') return JSON.stringify(error, null, 2);
    return error;
  };

  if (isLoading || isSaving)
    return (
      <View style={styles.state.container}>
        <View style={[styles.state.content, styles.state.loadingContainer]}>
          <ActivityIndicator size="large" color={colors['primary']} />
        </View>
      </View>
    );

  if (error)
    return (
      <View style={styles.state.container}>
        <View style={[styles.state.content, styles.state.errorContainer]}>
          <Text style={styles.state.errorText}>{renderError()}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => actions.setError(null)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  if (!item || (items && items.length === 0))
    return (
      <View style={styles.state.container}>
        <View style={[styles.state.content, styles.state.loadingContainer]}>
          <Text style={styles.state.errorText}>Não encontrado</Text>
        </View>
      </View>
    );

  return null;
};

export default StateStore;
