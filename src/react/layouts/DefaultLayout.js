import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useStore} from '@store';

import BottomCart from '@controleonline/ui-orders/src/react/components/cart/BottomCart';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import AppTypeSwitcher from '@controleonline/ui-common/src/react/components/AppTypeSwitcher';
import RuntimeBottomNavigationBar from '@controleonline/ui-common/src/react/components/RuntimeBottomNavigationBar';
import ShopBottomCart from '@controleonline/ui-shop/src/react/components/storefront/ShopBottomCart';
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
  resolveDeliveryWorkflowHead,
  resolveDeliveryWorkflowRouteName,
} from '@controleonline/ui-logistic/src/react/utils/deliveryAcceptanceQueue';
import {resolveCurrentPeopleIri} from '@controleonline/ui-logistic/src/react/utils/deliveryIdentity';
import {getBottomNavigationBaseHeight} from '@controleonline/ui-layout/src/react/utils/posBottomNavigation';
import {app_type, app_type_base} from '@appType';
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
  const websocketStore = useStore('websocket');
  const deviceConfigStore = useStore('device_config');
  const {item: device} = deviceConfigStore.getters;
  const currentUser = authStore?.getters?.user || null;
  const appType = app_type;
  const isShopApp = appType === 'SHOP';
  const isPosApp = appType === 'POS';
  const isDeliveryApp = appType === 'DELIVERY';
  const isDeliveryWorkflowApp = isDeliveryApp || appType === 'MANAGER';
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
  const deliveryQueueWasLockedRef = useRef(false);
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
  const hasPosDeviceConfig = !!(device?.configs && Object.keys(device.configs).length > 0);
  const posToolbarItemMapper = item => {
    if (item?.menuKey === 'home' && !hasPosDeviceConfig) {
      return null;
    }

    if (item?.menuKey === 'cash_register') {
      if (!requiresCashRegisterLifecycle) {
        return null;
      }

      return {
        ...item,
        route: isCashRegisterClosed ? 'CloseCashRegister' : 'CashRegisterIndex',
      };
    }

    return item;
  };
  const renderBottomNavigationBar = (presetKey, itemMapper = null) => (
    <RuntimeBottomNavigationBar
      navigation={navigation}
      menuType="toolbar"
      presetKey={presetKey}
      itemMapper={itemMapper}
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
  const websocketMessages = Array.isArray(websocketStore?.getters?.messages)
    ? websocketStore.getters.messages
    : [];
  const lastProcessedWebsocketMessageCountRef = useRef(websocketMessages.length);
  const deliveryQueueItems = Array.isArray(deliveryOrdersStore?.getters?.items)
    ? deliveryOrdersStore.getters.items
    : [];
  const deliveryQueueHead = resolveDeliveryWorkflowHead(deliveryQueueItems);
  const deliveryQueueHeadId = normalizeDeliveryOrderId(deliveryQueueHead?.id);
  const deliveryQueueRouteName = resolveDeliveryWorkflowRouteName(deliveryQueueHead);
  const shouldLockToDeliveryQueue = Boolean(
    isDeliveryWorkflowApp &&
      deliveryQueueHeadId &&
      deliveryQueueRouteName &&
      (
        currentRouteName !== deliveryQueueRouteName ||
        (deliveryQueueRouteName !== 'DeliveryRunPage' && currentRouteOrderId !== deliveryQueueHeadId)
      ),
  );
  const replaceWebLocation = href => {
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      typeof window.location?.replace === 'function'
    ) {
      window.location.replace(href);
      return true;
    }

    return false;
  };

  // Reserve the dock plus the runtime footer that now lives under it.
  const bottomChromeBaseHeight = 44;
  const bottomChromeOffset = shouldRenderBottomToolBar
    ? toolbarBaseHeight + bottomChromeBaseHeight + Math.max(insets.bottom, 10)
    : 0;

  const bottomInsetCompensation = bottomChromeOffset;
  const cartBottomOffset = bottomChromeOffset;
  const showAdminAppTypeSwitcher =
    Platform.OS === 'web' &&
    app_type_base === 'ADMIN';

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
      !isDeliveryWorkflowApp ||
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
    isDeliveryWorkflowApp,
  ]);

  useEffect(() => {
    if (!currentPeopleIri) {
      return;
    }

    lastProcessedWebsocketMessageCountRef.current = websocketMessages.length;
  }, [currentPeopleIri, isDeliveryWorkflowApp, websocketMessages.length]);

  useEffect(() => {
    if (!isDeliveryWorkflowApp || !currentPeopleIri) {
      return undefined;
    }

    if (websocketMessages.length <= lastProcessedWebsocketMessageCountRef.current) {
      return undefined;
    }

    const newMessages = websocketMessages.slice(lastProcessedWebsocketMessageCountRef.current);
    lastProcessedWebsocketMessageCountRef.current = websocketMessages.length;

    if (
      newMessages.some(message => {
        const storeName = String(message?.store || '').trim().toLowerCase();
        return storeName === 'orders' || storeName === 'delivery_orders';
      })
    ) {
      if (
        typeof deliveryOrdersStore?.actions?.getItems === 'function' &&
        deliveryQueueLoadOwnerRef.current !== currentPeopleIri
      ) {
        let cancelled = false;
        deliveryQueueLoadOwnerRef.current = currentPeopleIri;

        Promise.resolve(
          deliveryOrdersStore.actions.getItems({
            orderType: 'delivery',
            provider: currentPeopleIri,
          }),
        )
          .catch(() => {})
          .finally(() => {
            if (!cancelled && deliveryQueueLoadOwnerRef.current === currentPeopleIri) {
              deliveryQueueLoadOwnerRef.current = '';
            }
          });

        return () => {
          cancelled = true;
        };
      }
    }

    return undefined;
  }, [currentPeopleIri, deliveryOrdersStore?.actions?.getItems, isDeliveryWorkflowApp, websocketMessages]);

  useEffect(() => {
    if (!shouldLockToDeliveryQueue) {
      return;
    }

    deliveryQueueWasLockedRef.current = true;
    const nextParams =
      deliveryQueueRouteName === 'DeliveryRunPage'
        ? {
            store: 'orders',
            showBottomToolBar: false,
          }
        : buildOrderDetailsRouteParams(deliveryQueueHeadId, {
            store: 'orders',
          });
    const nextHref =
      deliveryQueueRouteName === 'DeliveryRunPage'
        ? `/delivery/run?${new URLSearchParams(nextParams).toString()}`
        : `/order-details?${new URLSearchParams(nextParams).toString()}`;

    if (replaceWebLocation(nextHref)) {
      return;
    }

    if (typeof navigation.replace === 'function') {
      navigation.replace(deliveryQueueRouteName, nextParams);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: deliveryQueueRouteName,
          params: nextParams,
        },
      ],
    });
  }, [
    deliveryQueueHeadId,
    deliveryQueueRouteName,
    currentRouteName,
    currentRouteOrderId,
    navigation,
    shouldLockToDeliveryQueue,
  ]);

  useEffect(() => {
    if (!isDeliveryWorkflowApp || deliveryQueueHeadId) {
      if (deliveryQueueHeadId) {
        deliveryQueueWasLockedRef.current = true;
      }

      return;
    }

    if (!deliveryQueueWasLockedRef.current) {
      return;
    }

    deliveryQueueWasLockedRef.current = false;
    if (currentRouteName === 'DeliveryRunPage') {
      return;
    }
    if (replaceWebLocation('/delivery/orders')) {
      return;
    }

    if (typeof navigation.replace === 'function') {
      navigation.replace('DeliveryOrdersPage');
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'DeliveryOrdersPage',
        },
      ],
    });
  }, [
    deliveryQueueHeadId,
    isDeliveryWorkflowApp,
    navigation,
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
      {showAdminAppTypeSwitcher && (
        <View style={styles.adminToolsContainer}>
          <AppTypeSwitcher />
        </View>
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
          {appType === 'POS' && !shouldHidePosToolbar &&
            renderBottomNavigationBar('posToolbar', posToolbarItemMapper)}
          {appType === 'DELIVERY' && isModernDockEnabled &&
            renderBottomNavigationBar('deliveryDock')}
          {appType === 'PPC' && renderBottomNavigationBar('ppcDock')}
        </>
      )}
    </View>
  );
};

export default DefaultLayout;
