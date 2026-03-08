import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomToolbar from '@controleonline/ui-crm/src/react/components/BottomToolbar';
import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import ManagerToolbar from '@controleonline/ui-manager/src/react/components/ManagerToolbar';
import PPCToolbar from '@controleonline/ui-ppc/src/react/components/PPCToolbar';
import ShopToolbar from '@controleonline/ui-shop/src/react/components/ShopToolbar';

import { env } from '@env';

const DefaultLayout = ({ children, navigation, options }) => {
  const showBottomToolBar = options?.showBottomToolBar;
  const insets = useSafeAreaInsets();

  // CRM toolbar is rendered as absolute overlay, so reserve space in content.
  const bottomInsetCompensation =
    showBottomToolBar
      ? 62 + Math.max(insets.bottom, 8)
      : 0;

  return (
    <View style={styles.container}>
      {options?.showCompanyFilter && <CompanyFilter />}
      <View style={[styles.content, { paddingBottom: bottomInsetCompensation }]}>
        {children}
      </View>
      {options?.showBottomCart && <BottomCart navigation={navigation} />}
      {showBottomToolBar && (
        <>
          {env.APP_TYPE === 'CRM' && <BottomToolbar navigation={navigation} />}
          {env.APP_TYPE === 'MANAGER' && <ManagerToolbar navigation={navigation} />}
          {env.APP_TYPE === 'POS' && <ShopToolbar navigation={navigation} />}
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
