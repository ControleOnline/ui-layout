import React, {useCallback, useLayoutEffect} from 'react';
import CompanyFilter from '@controleonline/ui-manager/src/react/components/CompanyFilter';
import DefaultCompanyHeader from './DefaultCompanyHeader';
import styles from './DefaultLayout.styles';

export const resolveBooleanOverride = value => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'true' ? true : normalized === 'false' ? false : null;
};

export default function useDefaultLayoutHeader({navigation, currentRouteName, currentCompany, mainCompany, isDesktopWeb, showHeaderCompanyFilter, companyFilterMode}) {
  const goToHome = useCallback(() => {
    if (currentRouteName !== 'HomePage') navigation?.navigate?.('HomePage');
  }, [currentRouteName, navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: isDesktopWeb && currentCompany ? props => <DefaultCompanyHeader {...props} company={currentCompany} mainCompany={mainCompany} onHome={goToHome} /> : undefined,
      headerBackground: undefined,
      headerRightContainerStyle: showHeaderCompanyFilter ? styles.headerRightContainer : undefined,
      headerRight: showHeaderCompanyFilter ? () => <CompanyFilter navigation={navigation} mode={companyFilterMode} /> : undefined,
    });
  }, [currentCompany, mainCompany, goToHome, isDesktopWeb, navigation, companyFilterMode, showHeaderCompanyFilter]);
}
