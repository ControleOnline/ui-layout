export const POS_TOOLBAR_ROUTE_NAMES = new Set([
  'HomePage',
  'AddProductScreen',
  'OrderHistoryPage',
  'CashRegisterIndex',
  'CloseCashRegister',
  'Withdrawal',
  'PrintQueuePage',
  'ProfilePage',
]);

export const OWNED_BOTTOM_CART_ROUTE_NAMES = new Set([
  'OrderDetails',
]);

export const resolveDefaultLayoutRoute = (navigation, route) => {
  const state = navigation?.getState?.();
  const active = state?.routes?.[state?.index];
  return {currentRouteName: route?.name || active?.name, currentRouteParams: route?.params || active?.params || {}};
};
