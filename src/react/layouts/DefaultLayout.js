import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useStore} from '@store';

import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import RuntimeBottomNavigationBar from '@controleonline/ui-common/src/react/components/RuntimeBottomNavigationBar';
import ShopBottomCart from '@controleonline/ui-shop/src/react/components/storefront/ShopBottomCart';
import PDVToolbar from '@controleonline/ui-orders/src/react/components/PDVToolbar';
import PosKioskBarcodeListener from '@controleonline/ui-orders/src/react/components/PosKioskBarcodeListener';
import {
  isPosCashRegisterClosed,
  isPosTotemMode,
  shouldUsePosCashRegisterLifecycle,
} from '@controleonline/ui-common/src/react/config/deviceConfigBootstrap';
import {
  buildOrderDetailsRouteParams,
  isPdvRouteContext,
} from '@controleonline/ui-orders/src/react/utils/orderRoute';
import {
  normalizeDeliveryOrderId,
  resolveDeliveryAcceptanceQueueHead,
} from '@controleonline/ui-logistic/src/react/utils/deliveryAcceptanceQueue';
import {resolveCurrentPeopleIri} from '@controleonline/ui-logistic/src/react/utils/deliveryIdentity';
import {getBottomNavigationBaseHeight} from '@controleonline/ui-layout/src/react/utils/posBottomNavigation';

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
  const authStore = useStore('auth');
  const deliveryOrdersStore = useStore('delivery_orders');
  const deviceConfigStore = useStore('device_config');
  const {item: device} = deviceConfigStore.getters;
  const currentUser = authStore?.getters?.user || null;
  const appType = String(env.APP_TYPE || '').toUpperCase();
  const isShopApp = appType === 'SHOP';
  const isPosApp = appType === 'POS';
  const isDeliveryApp = appType === 'DELIVERY';
  const currentPeopleIri = useMemo(
    () => resolveCurrentPeopleIri(currentUser),
    [currentUser],
  );
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
  const [deliveryQueueLoadedForIri, setDeliveryQueueLoadedForIri] = useState('');
  const deliveryQueueLoadOwnerRef = useRef('');
  const navigationState = navigation?.getState?.();
  const currentRouteName =
    route?.name || navigationState?.routes?.[navigationState?.index]?.name;
  const currentRouteParams =
    route?.params || navigationState?.routes?.[navigationState?.index]?.params || {};
  const currentRouteOrderId = normalizeDeliveryOrderId(currentRouteParams?.id);
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
  const renderBottomNavigationBar = presetKey => (
    <RuntimeBottomNavigationBar
      navigation={navigation}
      menuType="toolbar"
      presetKey={presetKey}
    />
  );
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
  const toolbarBaseHeight = getBottomNavigationBaseHeight(appType);
  const deliveryQueueItems = Array.isArray(deliveryOrdersStore?.getters?.items)
    ? deliveryOrdersStore.getters.items
    : [];
  const deliveryQueueHead = useMemo(
    () =>
      deliveryQueueLoadedForIri === currentPeopleIri
        ? resolveDeliveryAcceptanceQueueHead(deliveryQueueItems)
        : null,
    [currentPeopleIri, deliveryQueueItems, deliveryQueueLoadedForIri],
  );
  const deliveryQueueHeadId = normalizeDeliveryOrderId(deliveryQueueHead?.id);
  const shouldLockToDeliveryQueue = Boolean(
    isDeliveryApp &&
      deliveryQueueHeadId &&
      (
        currentRouteName !== 'OrderDetails' ||
        currentRouteOrderId !== deliveryQueueHeadId
      ),
  );

  // Reserve the dock plus the runtime footer that now lives under it.
  const bottomChromeBaseHeight = 44;
  const bottomChromeOffset = shouldRenderBottomToolBar
    ? toolbarBaseHeight + bottomChromeBaseHeight + Math.max(insets.bottom, 10)
    : 0;

  const bottomInsetCompensation = bottomChromeOffset;
  const cartBottomOffset = bottomChromeOffset;

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
      !isDeliveryApp ||
      !currentPeopleIri ||
      typeof deliveryOrdersStore?.actions?.getItems !== 'function'
    ) {
      return undefined;
    }

    if (
      deliveryQueueLoadedForIri === currentPeopleIri ||
      deliveryQueueLoadOwnerRef.current === currentPeopleIri
    ) {
      return undefined;
    }

    let cancelled = false;
    deliveryQueueLoadOwnerRef.current = currentPeopleIri;

    Promise.resolve(
      deliveryOrdersStore.actions.getItems({
        orderType: 'delivery',
        provider: currentPeopleIri,
      }),
    )
      .then(() => {
        if (!cancelled) {
          setDeliveryQueueLoadedForIri(currentPeopleIri);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDeliveryQueueLoadedForIri('');
        }
      })
      .finally(() => {
        if (deliveryQueueLoadOwnerRef.current === currentPeopleIri) {
          deliveryQueueLoadOwnerRef.current = '';
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentPeopleIri,
    deliveryOrdersStore?.actions?.getItems,
    deliveryQueueLoadedForIri,
    isDeliveryApp,
  ]);

  useEffect(() => {
    if (!shouldLockToDeliveryQueue) {
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'OrderDetails',
          params: buildOrderDetailsRouteParams(deliveryQueueHeadId, {
            store: 'orders',
          }),
        },
      ],
    });
  }, [
    deliveryQueueHeadId,
    currentRouteName,
    currentRouteOrderId,
    navigation,
    shouldLockToDeliveryQueue,
  ]);

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
          {appType === 'CRM' && renderBottomNavigationBar('crmToolbar')}
          {appType === 'MANAGER' &&
            (isModernDockEnabled
              ? renderBottomNavigationBar('managerDock')
              : renderBottomNavigationBar('managerToolbar'))}
          {appType === 'POS' && !shouldHidePosToolbar && (
            <PDVToolbar navigation={navigation} />
          )}
          {appType === 'DELIVERY' && isModernDockEnabled &&
            renderBottomNavigationBar('deliveryDock')}
          {appType === 'PPC' && renderBottomNavigationBar('ppcDock')}
        </>
      )}
    </View>
  );
};

export default DefaultLayout;
