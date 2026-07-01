import { StyleSheet, Platform } from 'react-native';

const withAlpha = (color, alphaHex) => {
  const raw = String(color || '').trim().replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw}${alphaHex}`;
  }

  if (/^[0-9a-fA-F]{8}$/.test(raw)) {
    return `#${raw.slice(0, 6)}${alphaHex}`;
  }

  return color;
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
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
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

export default createStyles;
