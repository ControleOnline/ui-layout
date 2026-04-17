import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomToolbar from '@controleonline/ui-crm/src/react/components/BottomToolbar';
import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import ManagerToolbar from '@controleonline/ui-manager/src/react/components/ManagerToolbar';
import PPCToolbar from '@controleonline/ui-ppc/src/react/components/PPCToolbar';
import ShopBottomCart from '@controleonline/ui-shop/src/react/components/storefront/ShopBottomCart';
import ShopToolbar from '@controleonline/ui-shop/src/react/components/ShopToolbar';
import PDVToolbar from '@controleonline/ui-orders/src/react/components/PDVToolbar';
import AppBottomDock from '@controleonline/ui-layout/src/react/components/AppBottomDock';

import { env } from '@env';
import styles from './DefaultLayout.styles';

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
  const appType = String(env.APP_TYPE || '').toUpperCase();
  const isShopApp = appType === 'SHOP' || appType === 'DELIVERY';
  const navigationState = navigation?.getState?.();
  const currentRouteName = navigationState?.routes?.[navigationState?.index]?.name;
  const currentRouteParams = navigationState?.routes?.[navigationState?.index]?.params || {};
  const shouldHideBottomToolBar = !!currentRouteParams?.hideBottomToolBar;
  const effectiveShowBottomToolBar = !!showBottomToolBar && !shouldHideBottomToolBar;
  const modernDockRouteNames = new Set([
    'DisplayList',
    'DisplayDetails',
    'OrderDetails',
    'AddProductScreen',
  ]);

  const isModernDockEnabled =
    effectiveShowBottomToolBar &&
    (appType === 'MANAGER' || appType === 'PPC') &&
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
      {showBottomCart &&
        (isShopApp ? (
          <ShopBottomCart
            navigation={navigation}
            bottomOffset={cartBottomOffset}
          />
        ) : (
          <BottomCart
            navigation={navigation}
            bottomOffset={cartBottomOffset}
          />
        ))}
      {effectiveShowBottomToolBar && (
        <>
          {appType === 'CRM' && <BottomToolbar navigation={navigation} />}
          {appType === 'MANAGER' && (
            isModernDockEnabled
              ? <AppBottomDock navigation={navigation} variant="manager" />
              : <ManagerToolbar navigation={navigation} />
          )}
          {appType === 'POS' && <PDVToolbar navigation={navigation} />}
          {appType === 'PPC' && (
            isModernDockEnabled
              ? <AppBottomDock navigation={navigation} variant="ppc" />
              : <PPCToolbar navigation={navigation} />
          )}
        </>
      )}
    </View>
  );
};

export default DefaultLayout;
