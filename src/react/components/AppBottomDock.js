import React from 'react';
import RuntimeBottomNavigationBar from '@controleonline/ui-common/src/react/components/RuntimeBottomNavigationBar';

const AppBottomDock = ({navigation, variant = 'manager'}) => {
  const presetKey =
    variant === 'ppc' ? 'ppcDock' : variant === 'delivery' ? 'deliveryDock' : 'managerDock';

  return (
    <RuntimeBottomNavigationBar
      navigation={navigation}
      menuType="toolbar"
      presetKey={presetKey}
    />
  );
};

export default AppBottomDock;
