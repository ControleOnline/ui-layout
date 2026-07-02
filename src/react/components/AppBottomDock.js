import React, {useEffect, useMemo, useState} from 'react';
import { useNavigationState } from '@react-navigation/native';
import { useStore } from '@store';
import {api} from '@controleonline/ui-common/src/api';
import BottomNavigationBar from '@controleonline/ui-common/src/react/components/BottomNavigationBar';
import {
  getBottomNavigationPreset,
  resolveBottomNavigationRoute,
} from '@controleonline/ui-common/src/react/components/BottomNavigationBar.config';
import {
  flattenRuntimeMenuItemsByType,
  normalizeRuntimeMenuResponse,
  resolveRuntimeMenuLabel,
} from '@controleonline/ui-common/src/react/utils/runtimeMenu';

const AppBottomDock = ({ navigation, variant = 'manager' }) => {
  const state = useNavigationState(current => current);
  const activeRouteName = state?.routes?.[state.index]?.name || 'HomePage';
  const menuAppType =
    variant === 'ppc' ? 'PPC' : variant === 'delivery' ? 'DELIVERY' : 'MANAGER';

  const peopleStore = useStore('people');
  const themeStore = useStore('theme');
  const currentCompany = peopleStore?.getters?.currentCompany;
  const colors = themeStore?.getters?.colors || {};
  const [runtimeMenus, setRuntimeMenus] = useState([]);

  const presetKey =
    variant === 'ppc' ? 'ppcDock' : variant === 'delivery' ? 'deliveryDock' : 'managerDock';
  const preset = getBottomNavigationPreset(presetKey);
  useEffect(() => {
    if (!currentCompany?.id || !menuAppType) {
      setRuntimeMenus([]);
      return undefined;
    }

    let cancelled = false;
    setRuntimeMenus([]);

    api
      .fetch('menus-people', {
        params: {
          myCompany: currentCompany.id,
          appType: menuAppType,
          menuType: 'toolbar',
        },
      })
      .then(result => {
        if (!cancelled) {
          setRuntimeMenus(
            normalizeRuntimeMenuResponse(result, {
              appType: menuAppType,
              allowFallback: false,
            }),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRuntimeMenus([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentCompany?.id, menuAppType]);

  const navItems = useMemo(
    () =>
      flattenRuntimeMenuItemsByType(runtimeMenus, 'toolbar')
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
        .filter(item => Boolean(item.route)),
    [runtimeMenus, global.t?.t],
  );
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
