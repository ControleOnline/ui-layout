import React, {useLayoutEffect} from 'react';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import styles from './DefaultLayout.styles';

export const resolveBooleanOverride = value => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'true' ? true : normalized === 'false' ? false : null;
};

/**
 * Header company switcher is the centered logo (CompanyFilter mode=logo).
 * Legacy header-right / DefaultCompanyHeader desktop-only logo is retired so
 * mobile and desktop share the same selector surface (app-community#1340).
 */
export default function useDefaultLayoutHeader({
  navigation,
  showHeaderLogoCompanySelector = false,
}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: showHeaderLogoCompanySelector
        ? () => <CompanyFilter navigation={navigation} mode="logo" />
        : undefined,
      header: undefined,
      headerBackground: undefined,
      headerRightContainerStyle: undefined,
      headerRight: undefined,
    });
  }, [navigation, showHeaderLogoCompanySelector]);
}
