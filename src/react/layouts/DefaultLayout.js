import React from 'react';
import { View, StyleSheet } from 'react-native';

import BottomToolbar from '@controleonline/ui-crm/src/react/components/BottomToolbar';
import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import ManagerToolbar from '@controleonline/ui-manager/src/react/components/ManagerToolbar';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import ShopToolbar from '@controleonline/ui-shop/src/react/components/ShopToolbar';
import PPCToolbar from '@controleonline/ui-ppc/src/react/components/PPCToolbar';


import { env } from '@env';

const DefaultLayout = ({ children, navigation, route }) => {
  console.log(route);

  return (
    <View style={styles.container}>
      {route.showCompanyFilter && <CompanyFilter />}
      <View style={styles.content}>{children}</View>
      {route.showToolbar && (
        <>
          {env.APP_TYPE === 'CRM' && <BottomToolbar navigation={navigation} />}
          {env.APP_TYPE === 'MANAGER' && <ManagerToolbar navigation={navigation} />}
          {env.APP_TYPE === 'MENU' && <ShopToolbar navigation={navigation} />}
          {env.APP_TYPE === 'POS' && <BottomCart navigation={navigation} />}
          {env.APP_TYPE === 'PPC' && <PPCToolbar navigation={navigation} />}
        </>
      )}
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

export default DefaultLayout;
