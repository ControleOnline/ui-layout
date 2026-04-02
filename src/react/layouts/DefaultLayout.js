import React, { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomToolbar from '@controleonline/ui-crm/src/react/components/BottomToolbar';
import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import ManagerToolbar from '@controleonline/ui-manager/src/react/components/ManagerToolbar';
import PPCToolbar from '@controleonline/ui-ppc/src/react/components/PPCToolbar';
import ShopToolbar from '@controleonline/ui-shop/src/react/components/ShopToolbar';
import AppBottomDock from '@controleonline/ui-layout/src/react/components/AppBottomDock';

import { env } from '@env';

const DefaultLayout = ({ children, navigation, options }) => {
  const showBottomToolBar = options?.showBottomToolBar;
  const showBottomCart = options?.showBottomCart;
  const showInlineCompanyFilter =
    options?.showCompanyFilter && options?.companyFilterMode !== 'icon';
  const showHeaderCompanyFilter =
    options?.showCompanyFilter &&
    options?.companyFilterMode === 'icon' &&
    options?.headerShown !== false;
  const insets = useSafeAreaInsets();
  const navigationState = navigation?.getState?.();
  const currentRouteName = navigationState?.routes?.[navigationState?.index]?.name;
  const currentRouteParams = navigationState?.routes?.[navigationState?.index]?.params || {};
  const shouldHideBottomToolBar = !!currentRouteParams?.hideBottomToolBar;
  const effectiveShowBottomToolBar = !!showBottomToolBar && !shouldHideBottomToolBar;
  const modernDockRouteNames = new Set([
    'DisplayList',
    'DisplayDetails',
    'OrderDetails',
    'OrderTools',
    'AddProductScreen',
  ]);

  const isModernDockEnabled =
    effectiveShowBottomToolBar &&
    (env.APP_TYPE === 'MANAGER' || env.APP_TYPE === 'PPC') &&
    modernDockRouteNames.has(currentRouteName);
  const toolbarBaseHeight = isModernDockEnabled ? 86 : 62;

  // Bottom bars are rendered as overlays, so reserve space in content.
  const bottomInsetCompensation =
    effectiveShowBottomToolBar
      ? toolbarBaseHeight + Math.max(insets.bottom, 8)
      : 0;

  const cartBottomOffset =
    effectiveShowBottomToolBar
      ? toolbarBaseHeight + Math.max(insets.bottom, 8)
      : 0;

  useLayoutEffect(() => {
    if (!showHeaderCompanyFilter) return;

    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <CompanyFilter
          navigation={navigation}
          mode={options?.companyFilterMode}
        />
      ),
    });
  }, [navigation, options?.companyFilterMode, showHeaderCompanyFilter]);

  return (
    <View style={[styles.container, { paddingTop: options?.headerShown === false ? insets.top : 0 }]}>
      {showInlineCompanyFilter && (
        <CompanyFilter
          navigation={navigation}
          mode={options?.companyFilterMode}
        />
      )}
      <View style={[styles.content, { paddingBottom: bottomInsetCompensation }]}>
        {children}
      </View>
      {showBottomCart && (
        <BottomCart
          navigation={navigation}
          bottomOffset={cartBottomOffset}
        />
      )}
      {effectiveShowBottomToolBar && (
        <>
          {env.APP_TYPE === 'CRM' && <BottomToolbar navigation={navigation} />}
          {env.APP_TYPE === 'MANAGER' && (
            isModernDockEnabled
              ? <AppBottomDock navigation={navigation} variant="manager" />
              : <ManagerToolbar navigation={navigation} />
          )}
          {env.APP_TYPE === 'POS' && <ShopToolbar navigation={navigation} />}
          {env.APP_TYPE === 'PPC' && (
            isModernDockEnabled
              ? <AppBottomDock navigation={navigation} variant="ppc" />
              : <PPCToolbar navigation={navigation} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    minHeight: 0,
    minWidth: 0,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    backgroundColor: '#f8f9fa',
  },
  headerRightContainer: {
    paddingRight: 16,
  },
});

export default DefaultLayout;
