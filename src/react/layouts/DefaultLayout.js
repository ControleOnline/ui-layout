import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useStore} from '@store';

import BottomToolbar from '@controleonline/ui-crm/src/react/components/BottomToolbar';
import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import ManagerToolbar from '@controleonline/ui-manager/src/react/components/ManagerToolbar';
import PPCToolbar from '@controleonline/ui-ppc/src/react/components/PPCToolbar';
import ShopBottomCart from '@controleonline/ui-shop/src/react/components/storefront/ShopBottomCart';
import PDVToolbar from '@controleonline/ui-orders/src/react/components/PDVToolbar';
import PosKioskBarcodeListener from '@controleonline/ui-orders/src/react/components/PosKioskBarcodeListener';
import AppBottomDock from '@controleonline/ui-layout/src/react/components/AppBottomDock';
import {
  isPosCashRegisterClosed,
  isPosSelfServiceMode,
  shouldUsePosCashRegisterLifecycle,
} from '@controleonline/ui-common/src/react/config/deviceConfigBootstrap';
import {isPdvRouteContext} from '@controleonline/ui-orders/src/react/utils/orderRoute';

import { env } from '@env';
import styles from './DefaultLayout.styles';

const resolveBooleanOverride = value => {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  return null;
};

const DefaultLayout = ({ children, navigation, route, options }) => {
  const insets = useSafeAreaInsets();
  const deviceConfigStore = useStore('device_config');
  const {item: device} = deviceConfigStore.getters;
  const appType = String(env.APP_TYPE || '').toUpperCase();
  const isShopApp = appType === 'SHOP';
  const isPosApp = appType === 'POS';
  const isSelfServiceMode = useMemo(
    () => isPosSelfServiceMode(device?.configs),
    [device?.configs],
  );
  const requiresCashRegisterLifecycle = useMemo(
    () => shouldUsePosCashRegisterLifecycle(device?.configs),
    [device?.configs],
  );
  const isCashRegisterClosed = useMemo(
    () => isPosCashRegisterClosed(device?.configs),
    [device?.configs],
  );
  const allowCompanyFilter = !isShopApp && options?.showCompanyFilter;
  const showBottomToolBar = options?.showBottomToolBar;
  const showBottomCart = options?.showBottomCart;
  const showInlineCompanyFilter =
    allowCompanyFilter && options?.companyFilterMode !== 'icon';
  const showHeaderCompanyFilter =
    allowCompanyFilter &&
    options?.companyFilterMode === 'icon' &&
    options?.headerShown !== false;
  const navigationState = navigation?.getState?.();
  const currentRouteName =
    route?.name || navigationState?.routes?.[navigationState?.index]?.name;
  const currentRouteParams =
    route?.params || navigationState?.routes?.[navigationState?.index]?.params || {};
  const shouldHideBottomToolBar = !!currentRouteParams?.hideBottomToolBar;
  const showBottomToolBarOverride = resolveBooleanOverride(
    currentRouteParams?.showBottomToolBar,
  );
  const effectiveShowBottomToolBar =
    (
      showBottomToolBarOverride !== null
        ? showBottomToolBarOverride
        : !!showBottomToolBar
    ) && !shouldHideBottomToolBar;
  const showBottomCartOverride = resolveBooleanOverride(
    currentRouteParams?.showBottomCart,
  );
  const effectiveShowBottomCart =
    showBottomCartOverride !== null
      ? showBottomCartOverride
      : !!showBottomCart;
  const modernDockRouteNames = new Set([
    'DisplayList',
    'DisplayDetails',
    'OrderDetails',
    'AddProductScreen',
  ]);
  const selfServiceBlockedRouteNames = useMemo(
    () =>
      new Set([
        'HomePage',
        'Withdrawal',
        'PrintQueuePage',
        'OrderHistoryPage',
        'ProfilePage',
        ...(requiresCashRegisterLifecycle ? ['CashRegisterIndex'] : []),
      ]),
    [requiresCashRegisterLifecycle],
  );

  const isModernDockEnabled =
    effectiveShowBottomToolBar &&
    (appType === 'MANAGER' || appType === 'PPC') &&
    modernDockRouteNames.has(currentRouteName);
  const shouldHidePosToolbar = isPosApp && isSelfServiceMode;
  const shouldEnablePosScanner =
    isPosApp || isPdvRouteContext(currentRouteParams);
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

  useEffect(() => {
    if (
      !isPosApp ||
      !isSelfServiceMode ||
      !selfServiceBlockedRouteNames.has(currentRouteName)
    ) {
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name:
            requiresCashRegisterLifecycle && isCashRegisterClosed
              ? 'CloseCashRegister'
              : 'AddProductScreen',
        },
      ],
    });
  }, [
    currentRouteName,
    isCashRegisterClosed,
    isPosApp,
    isSelfServiceMode,
    navigation,
    requiresCashRegisterLifecycle,
    selfServiceBlockedRouteNames,
  ]);

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
      <PosKioskBarcodeListener
        enabled={shouldEnablePosScanner}
        currentRouteName={currentRouteName}
        interactionParams={currentRouteParams}
        navigation={navigation}
      />
      {effectiveShowBottomCart &&
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
          {appType === 'POS' && !shouldHidePosToolbar && (
            <PDVToolbar navigation={navigation} />
          )}
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
