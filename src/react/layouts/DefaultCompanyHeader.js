import React from 'react';
import {View} from 'react-native';
import {Header, getHeaderTitle} from '@react-navigation/elements';
import DefaultCompanyHeaderLogo from './DefaultCompanyHeaderLogo';

/** Keep branding above the header background, with the original title and controls. */
export default function DefaultCompanyHeader({options, route, back, company, mainCompany, onHome}) {
  return <View style={{position: 'relative'}}>
    <Header {...options} back={back} title={getHeaderTitle(options, route.name)}
      headerBackground={undefined}
      headerLeft={options.headerBackVisible === false ? () => null : options.headerLeft} />
    <DefaultCompanyHeaderLogo company={company} mainCompany={mainCompany} onPress={onHome} />
  </View>;
}
