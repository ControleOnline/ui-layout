import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import { useStore } from '@store';
import BottomNavigationBar from '@controleonline/ui-common/src/react/components/BottomNavigationBar';

const MANAGER_ITEMS = [
  { route: 'HomePage', label: 'Home', icon: 'home' },
  { route: 'CrmIndex', label: 'Oportunidades', icon: 'dollar-sign' },
  { route: 'ClientsIndex', label: 'Clientes', icon: 'users' },
  { route: 'ProfilePage', label: 'Perfil', icon: 'user' },
];

const PPC_ITEMS = [
  { route: 'HomePage', label: 'Home', icon: 'home' },
  { route: 'DisplayList', label: 'Displays', icon: 'monitor' },
  { route: 'ProfilePage', label: 'Perfil', icon: 'user' },
];

const DELIVERY_ITEMS = [
  { route: 'HomePage', label: 'Home', icon: 'home' },
  { route: 'DeliveryOrdersPage', label: 'Pedidos', icon: 'shopping-bag' },
  { route: 'DeliveryReceivablesPage', label: 'Recebiveis', icon: 'dollar-sign' },
  { route: 'DeliveryCompaniesPage', label: 'Empresas', icon: 'users' },
  { route: 'DeliveryRateTablesPage', label: 'Tabelas', icon: 'list' },
];

const MANAGER_ROUTE_ALIASES = {
  ClientDetails: 'ClientsIndex',
  EmployeesIndex: 'ClientsIndex',
  FranchiseesIndex: 'ClientsIndex',
};

const DELIVERY_ROUTE_ALIASES = {
  OrderDetails: 'DeliveryOrdersPage',
  OrderLogisticsPage: 'DeliveryOrdersPage',
  DeliveryVehicleSetupPage: 'DeliveryRateTablesPage',
  DeliveryRateTableFormPage: 'DeliveryRateTablesPage',
  DeliveryRateTableCompaniesPage: 'DeliveryRateTablesPage',
  DeliveryCourierSchedulesPage: 'DeliveryCompaniesPage',
  DeliveryCourierScheduleFormPage: 'DeliveryCompaniesPage',
  DeliveryCourierPresencePage: 'DeliveryCompaniesPage',
  DeliveryCourierPresenceHistoryPage: 'DeliveryCompaniesPage',
};

const AppBottomDock = ({ navigation, variant = 'manager' }) => {
  const state = useNavigationState(current => current);
  const activeRouteName = state?.routes?.[state.index]?.name || 'HomePage';

  const peopleStore = useStore('people');
  const themeStore = useStore('theme');
  const currentCompany = peopleStore?.getters?.currentCompany;
  const colors = themeStore?.getters?.colors || {};

  const navItems =
    variant === 'ppc'
      ? PPC_ITEMS
      : variant === 'delivery'
        ? DELIVERY_ITEMS
        : MANAGER_ITEMS;
  const resolvedActiveRoute =
    variant === 'ppc'
      ? activeRouteName
      : variant === 'delivery'
        ? DELIVERY_ROUTE_ALIASES[activeRouteName] || activeRouteName
        : MANAGER_ROUTE_ALIASES[activeRouteName] || activeRouteName;
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
