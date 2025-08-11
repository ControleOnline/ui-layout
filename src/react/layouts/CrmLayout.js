import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomToolbar from '@controleonline/ui-crm/src/react/components/BottomToolbar';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';

const CrmLayout = ({children, navigation}) => {
  return (
    <View style={styles.container}>
      <CompanyFilter />
      <View style={styles.content}>{children}</View>
      <BottomToolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default CrmLayout;
