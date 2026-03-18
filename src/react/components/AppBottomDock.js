import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '@store';

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

const withAlpha = (color, alphaHex) => {
  const raw = String(color || '').trim().replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw}${alphaHex}`;
  }

  if (/^[0-9a-fA-F]{8}$/.test(raw)) {
    return `#${raw.slice(0, 6)}${alphaHex}`;
  }

  return color || '#1B5587';
};

const AppBottomDock = ({ navigation, variant = 'manager' }) => {
  const insets = useSafeAreaInsets();
  const state = useNavigationState(current => current);
  const activeRouteName = state?.routes?.[state.index]?.name || 'HomePage';

  const peopleStore = useStore('people');
  const themeStore = useStore('theme');
  const currentCompany = peopleStore?.getters?.currentCompany;
  const colors = themeStore?.getters?.colors || {};

  const navItems = variant === 'ppc' ? PPC_ITEMS : MANAGER_ITEMS;
  const knownRoute = navItems.some(item => item.route === activeRouteName);
  const effectiveActiveRoute = knownRoute ? activeRouteName : navItems[0].route;
  const isCompanyValid = !!(currentCompany && Object.keys(currentCompany).length > 0);

  const primaryColor = colors.primary || '#1B5587';
  const dockBackground = colors['toolbar-background'] || '#F8FBFF';
  const borderColor = colors['toolbar-border'] || '#D1DDE9';
  const inactiveText = colors['toolbar-text-muted'] || '#64748B';
  const activeBg = withAlpha(primaryColor, '1A');
  const activeBorder = withAlpha(primaryColor, '55');

  const styles = useMemo(
    () =>
      createStyles({
        primaryColor,
        dockBackground,
        borderColor,
        inactiveText,
        activeBg,
        activeBorder,
        insets,
      }),
    [activeBg, activeBorder, borderColor, dockBackground, inactiveText, insets, primaryColor]
  );

  const navigateTo = routeName => {
    try {
      navigation.navigate(routeName);
    } catch (e) {
      // Avoid breaking UX when a route is not available in current app flavor.
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <View style={styles.dock}>
        {navItems.map(item => {
          const isActive = effectiveActiveRoute === item.route;
          const disabled = !isCompanyValid;

          return (
            <Pressable
              key={item.route}
              accessibilityRole="button"
              disabled={disabled}
              onPress={() => navigateTo(item.route)}
              style={({ pressed }) => [
                styles.item,
                isActive && styles.itemActive,
                pressed && !disabled && styles.itemPressed,
                disabled && styles.itemDisabled,
              ]}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Icon
                  color={isActive ? primaryColor : inactiveText}
                  name={item.icon}
                  size={18}
                />
              </View>
              <Text numberOfLines={1} style={[styles.itemLabel, isActive && styles.itemLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = ({
  primaryColor,
  dockBackground,
  borderColor,
  inactiveText,
  activeBg,
  activeBorder,
  insets,
}) =>
  StyleSheet.create({
    host: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 60,
      paddingHorizontal: 10,
      paddingTop: 8,
      paddingBottom: Math.max(insets.bottom, 10),
      backgroundColor: 'transparent',
    },
    dock: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 20,
      borderWidth: 1,
      borderColor,
      backgroundColor: dockBackground,
      paddingHorizontal: 6,
      paddingVertical: 6,
      ...(Platform.OS === 'android'
        ? { elevation: 8 }
        : {
            shadowColor: '#0F172A',
            shadowOpacity: 0.16,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 18,
          }),
    },
    item: {
      flex: 1,
      minHeight: 58,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      paddingVertical: 6,
      paddingHorizontal: 2,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    itemActive: {
      backgroundColor: activeBg,
      borderColor: activeBorder,
    },
    itemPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.99 }],
    },
    itemDisabled: {
      opacity: 0.45,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      backgroundColor: 'transparent',
    },
    iconWrapActive: {
      backgroundColor: withAlpha(primaryColor, '24'),
    },
    itemLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: inactiveText,
      textAlign: 'center',
    },
    itemLabelActive: {
      color: primaryColor,
      fontWeight: '800',
    },
  });

export default AppBottomDock;
