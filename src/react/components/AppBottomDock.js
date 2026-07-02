import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import { useStore } from '@store';
import BottomNavigationBar from '@controleonline/ui-common/src/react/components/BottomNavigationBar';
import {
  getBottomNavigationPreset,
  resolveBottomNavigationItems,
  resolveBottomNavigationRoute,
} from '@controleonline/ui-common/src/react/components/BottomNavigationBar.config';

const AppBottomDock = ({ navigation, variant = 'manager' }) => {
  const state = useNavigationState(current => current);
  const activeRouteName = state?.routes?.[state.index]?.name || 'HomePage';

  const peopleStore = useStore('people');
  const themeStore = useStore('theme');
  const currentCompany = peopleStore?.getters?.currentCompany;
  const colors = themeStore?.getters?.colors || {};

  const presetKey =
    variant === 'ppc' ? 'ppcDock' : variant === 'delivery' ? 'deliveryDock' : 'managerDock';
  const preset = getBottomNavigationPreset(presetKey);
  const navItems = resolveBottomNavigationItems(preset.items);
  const resolvedActiveRoute = resolveBottomNavigationRoute(
    preset.routeAliases,
    activeRouteName,
  );
  const knownRoute = navItems.some(item => item.route === resolvedActiveRoute);
  const effectiveActiveRoute = knownRoute ? resolvedActiveRoute : navItems[0].route;
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
