import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import { useStore } from '@store';
import BottomNavigationBar from '@controleonline/ui-common/src/react/components/BottomNavigationBar';
import {
  getBottomNavigationPreset,
  resolveBottomNavigationItems,
  resolveBottomNavigationRoute,
} from '@controleonline/ui-common/src/react/components/BottomNavigationBar.config';
import {
  flattenRuntimeMenuItemsByType,
  resolveRuntimeMenuLabel,
} from '@controleonline/ui-common/src/react/utils/runtimeMenu';

const AppBottomDock = ({ navigation, variant = 'manager' }) => {
  const state = useNavigationState(current => current);
  const activeRouteName = state?.routes?.[state.index]?.name || 'HomePage';

  const peopleStore = useStore('people');
  const themeStore = useStore('theme');
  const currentCompany = peopleStore?.getters?.currentCompany;
  const themeMenus = themeStore?.getters?.menus || [];
  const colors = themeStore?.getters?.colors || {};

  const presetKey =
    variant === 'ppc' ? 'ppcDock' : variant === 'delivery' ? 'deliveryDock' : 'managerDock';
  const preset = getBottomNavigationPreset(presetKey);
  const runtimeNavItems = flattenRuntimeMenuItemsByType(themeMenus, 'toolbar')
    .slice()
    .sort((left, right) => {
      const orderDiff = Number(left?.sortOrder || 0) - Number(right?.sortOrder || 0);
      if (orderDiff !== 0) return orderDiff;
      return String(left?.label || '').localeCompare(String(right?.label || ''));
    })
    .map(item => ({
      route: item.route,
      icon: item.icon || 'circle',
      label: resolveRuntimeMenuLabel(item, global.t?.t),
      routeParams: item.routeParams,
      menuType: item.menuType,
    }))
    .filter(item => Boolean(item.route));
  const navItems =
    runtimeNavItems.length > 0
      ? runtimeNavItems
      : resolveBottomNavigationItems(preset.items, global.t?.t);
  const resolvedActiveRoute = resolveBottomNavigationRoute(
    preset.routeAliases,
    activeRouteName,
  );
  const knownRoute = navItems.some(item => item.route === resolvedActiveRoute);
  const effectiveActiveRoute = knownRoute
    ? resolvedActiveRoute
    : navItems[0]?.route || activeRouteName;
  const isCompanyValid = !!(currentCompany && Object.keys(currentCompany).length > 0);

  return (
    <BottomNavigationBar
      activeRouteName={effectiveActiveRoute}
      colors={colors}
      disabled={!isCompanyValid}
      items={navItems}
      navigation={navigation}
    />
  );
};



export default AppBottomDock;
