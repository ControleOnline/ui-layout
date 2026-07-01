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
  isPosTotemMode,
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

const POS_TOOLBAR_ROUTE_NAMES = new Set([
  'HomePage',
  'AddProductScreen',
  'OrderHistoryPage',
  'CashRegisterIndex',
  'CloseCashRegister',
  'Withdrawal',
  'PrintQueuePage',
  'ProfilePage',
]);

const OWNED_BOTTOM_CART_ROUTE_NAMES = new Set([
  'OrderDetails',
]);

const DefaultLayout = ({ children, navigation, route, options }) => {
  const insets = useSafeAreaInsets();
  const deviceConfigStore = useStore('device_config');
  const {item: device} = deviceConfigStore.getters;
  const appType = String(env.APP_TYPE || '').toUpperCase();
  const isShopApp = appType === 'SHOP';
  const isPosApp = appType === 'POS';
  const isDeliveryApp = appType === 'DELIVERY';
  const isTotemMode = useMemo(
    () => isPosTotemMode(device?.configs),
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
  const shouldUseOwnedBottomCart =
    OWNED_BOTTOM_CART_ROUTE_NAMES.has(currentRouteName);
  const shouldHideBottomToolBar = !!currentRouteParams?.hideBottomToolBar;
  const showBottomToolBarOverride = resolveBooleanOverride(
    currentRouteParams?.showBottomToolBar,
  );
  const shouldForcePosToolbar =
    isPosApp &&
    !isTotemMode &&
    POS_TOOLBAR_ROUTE_NAMES.has(currentRouteName);
  const shouldForceAppToolbar = isDeliveryApp || shouldForcePosToolbar;
  const effectiveShowBottomToolBar =
    (
      (
        showBottomToolBarOverride !== null
          ? showBottomToolBarOverride
          : shouldForceAppToolbar
            ? true
          : !!showBottomToolBar
      ) && !shouldHideBottomToolBar
    );
  const showBottomCartOverride = resolveBooleanOverride(
    currentRouteParams?.showBottomCart,
  );
  const effectiveShowBottomCart =
    shouldUseOwnedBottomCart
      ? false
      : (
        showBottomCartOverride !== null
          ? showBottomCartOverride
          : !!showBottomCart
      );
  const modernDockRouteNames = new Set([
    'DisplayList',
    'DisplayDetails',
    'DisplayOrderConference',
    'OrderDetails',
    'AddProductScreen',
  ]);
  const totemBlockedRouteNames = useMemo(
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
    (
      (
        (appType === 'MANAGER' || appType === 'PPC') &&
        modernDockRouteNames.has(currentRouteName)
      ) ||
      isDeliveryApp
    );
  const shouldHidePosToolbar = isPosApp && isTotemMode;
  const shouldRenderBottomToolBar =
    effectiveShowBottomToolBar &&
    (
      appType === 'CRM' ||
      appType === 'MANAGER' ||
      appType === 'PPC' ||
      (appType === 'POS' && !shouldHidePosToolbar) ||
      isDeliveryApp
    );
  const shouldEnablePosScanner =
    isPosApp || isPdvRouteContext(currentRouteParams);
  const toolbarBaseHeight = isModernDockEnabled ? 86 : 62;

  // Bottom bars are rendered as overlays, so reserve space in content.
  const bottomInsetCompensation =
    shouldRenderBottomToolBar
      ? toolbarBaseHeight + Math.max(insets.bottom, 8)
      : 0;

  const cartBottomOffset =
    shouldRenderBottomToolBar
      ? toolbarBaseHeight + Math.max(insets.bottom, 8)
      : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: showHeaderCompanyFilter
        ? styles.headerRightContainer
        : undefined,
      headerRight: showHeaderCompanyFilter
        ? () => (
          <CompanyFilter
            navigation={navigation}
            mode={options?.companyFilterMode}
          />
        )
        : undefined,
    });
  }, [navigation, options?.companyFilterMode, showHeaderCompanyFilter]);

  useEffect(() => {
    if (
      !isPosApp ||
      !isTotemMode ||
      !totemBlockedRouteNames.has(currentRouteName)
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
    isTotemMode,
    isPosApp,
    navigation,
    requiresCashRegisterLifecycle,
    totemBlockedRouteNames,
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
      {shouldRenderBottomToolBar && (
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
          {appType === 'DELIVERY' && isModernDockEnabled && (
            <AppBottomDock navigation={navigation} variant="delivery" />
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
