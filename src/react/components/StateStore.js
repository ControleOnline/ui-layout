import React from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import globalStyles from '@controleonline/ui-layout/src/react/styles/global';
import {useStore} from '@store';

const StateStore = ({store}) => {
  const currentStore = useStore(store) || {};
  const getters = currentStore?.getters || {};
  const actions = currentStore?.actions || {};
  const {isLoading = false, isSaving = false, error = null} = getters;
  const themeStore = useStore('theme') || {};
  const themeGetters = themeStore?.getters || {};
  const {colors = {primary: '#000'}} = themeGetters;
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

  return null;
};

export default StateStore;
