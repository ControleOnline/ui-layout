import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {env as APP_ENV} from '@env';
import {useStore} from '@store';
import DefaultFile from '@controleonline/ui-default/src/react/components/files/DefaultFile';
import {resolveDefaultFileSource} from '@controleonline/ui-common/src/react/utils/fileUrl';
import styles from './DefaultLayout.styles';

export const resolveHeaderCompanyBrand = (company, mainCompany) => {
  for (const [owner, file] of [[company, company?.logo], [company, company?.icon], [mainCompany, mainCompany?.logo], [mainCompany, mainCompany?.icon]]) {
    if (file && resolveDefaultFileSource(file, {company: owner})) return {company: owner, file};
  }
  return {company, file: null};
};

// FileService domains have no scheme. buildAssetUrl otherwise assumes HTTPS,
// even for the PHP development server, which only accepts HTTP.
export const resolveHeaderLogoFile = (file, company, apiEntryPoint) => {
  const source = resolveDefaultFileSource(file, {company});
  if (!source?.uri || !apiEntryPoint) return file;
  try {
    const apiUrl = new URL(apiEntryPoint);
    const imageUrl = new URL(source.uri);
    const loopback = ['localhost', '127.0.0.1', '[::1]'];
    if (apiUrl.protocol !== 'http:' || !loopback.includes(apiUrl.hostname) ||
      imageUrl.host !== apiUrl.host || imageUrl.protocol !== 'https:') return file;
    imageUrl.protocol = 'http:';
    return typeof file === 'object' ? {...file, url: imageUrl.href} : imageUrl.href;
  } catch {
    return file;
  }
};

// Authentication is scoped to the configured API origin; external branding is public.
export const resolveHeaderLogoSource = (file, company, apiEntryPoint) => {
  const resolvedFile = resolveHeaderLogoFile(file, company, apiEntryPoint);
  const source = resolveDefaultFileSource(resolvedFile, {company});
  const uri = source?.uri;
  let authenticated = false;
  try {
    const apiUrl = new URL(apiEntryPoint);
    const imageUrl = new URL(uri, apiUrl);
    authenticated = ['http:', 'https:'].includes(imageUrl.protocol) &&
      imageUrl.origin === apiUrl.origin && !imageUrl.username && !imageUrl.password;
  } catch {}
  return {file: resolvedFile, source: uri ? {uri} : null, authenticated};
};

export default function DefaultCompanyHeaderLogo({company, mainCompany, onPress, fallbackIcon}) {
  const authStore = useStore('auth');
  const themeStore = useStore('theme');
  const colors = themeStore?.getters?.colors || {};
  const token = authStore?.getters?.user?.api_key || authStore?.getters?.user?.token;
  const headers = token ? {'API-TOKEN': token} : {};
  const brand = resolveHeaderCompanyBrand(company, mainCompany);
  const logo = resolveHeaderLogoSource(brand.file, brand.company, APP_ENV.API_ENTRYPOINT);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [brand.file]);
  const name = brand.company?.alias || brand.company?.name || company?.alias || company?.name;
  return <View style={styles.headerCompanyLogoLayer} pointerEvents="box-none">
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Voltar para início" activeOpacity={0.82} style={styles.headerCompanyLogoButton} onPress={onPress}>
      {brand.file && !failed ? logo.authenticated
        ? <DefaultFile headers={headers} file={logo.file} company={brand.company} style={styles.headerCompanyLogo} resizeMode="contain" onError={() => setFailed(true)} />
        : <Image source={logo.source} style={styles.headerCompanyLogo} resizeMode="contain" onError={() => setFailed(true)} />
        : fallbackIcon ? <View style={[styles.headerCompanyFallbackIconWrap, {backgroundColor: colors.inputBackground || colors.panelBackground}]}><Icon name={fallbackIcon} size={22} color={colors.listItemIcon || colors.cardIcon || colors.icon || colors.headerText || colors.textPrimary || colors.text} /></View> : name ? <Text numberOfLines={1} style={{fontSize: 18, fontWeight: '600', color: colors.headerText || colors.textPrimary || colors.text, maxWidth: 180}}>{name}</Text> : null}
    </TouchableOpacity>
  </View>;
}
