import React from 'react';
import globalStyles from '@controleonline/ui-shop/src/react/styles/global';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {getStore} from '@store';

const StateStore = ({store}) => {
  const {getters} = getStore(store);
  const {item, items, isLoading, isSaving, error} = getters;
  const {getters: themeGetters} = getStore('theme');
  const {colors} = themeGetters;

  const renderError = () => {
    if (Array.isArray(error)) return error.join(', ');
    if (typeof error === 'object') return JSON.stringify(error, null, 2);
    return error;
  };

  if (isLoading || isSaving)
    return (
      <View style={globalStyles.container}>
        <View
          style={[globalStyles.content, globalStyles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors['primary']} />
        </View>
      </View>
    );

  if (error)
    return (
      <View style={globalStyles.container}>
        <View
          style={[globalStyles.content, globalStyles.loadingContainer]}>
          <Text style={globalStyles.errorText}>{renderError()}</Text>
        </View>
      </View>
    );

  if (!item && (!items || items.length === 0))
    return (
      <View style={globalStyles.container}>
        <View
          style={[globalStyles.content, globalStyles.loadingContainer]}>
          <Text style={globalStyles.errorText}>Não encontrado</Text>
        </View>
      </View>
    );
};

export default StateStore;
