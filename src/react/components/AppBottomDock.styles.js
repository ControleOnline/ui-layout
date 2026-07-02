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
      backgroundColor: 'transparent',
    },
    dock: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 60,
      paddingHorizontal: 8,
      paddingTop: 8,
      paddingBottom: Math.max(insets.bottom, 10),
      borderTopWidth: 1,
      borderTopColor: borderColor,
      backgroundColor: dockBackground,
      ...(Platform.OS === 'android'
        ? { elevation: 10 }
        : {
            shadowColor: '#0F172A',
            shadowOpacity: 0.12,
            shadowOffset: { width: 0, height: -6 },
            shadowRadius: 14,
          }),
    },
    item: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    itemActive: {
      borderTopWidth: 2,
      borderTopColor: activeBorder,
      backgroundColor: activeBg,
    },
    itemPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.99 }],
    },
    itemDisabled: {
      opacity: 0.45,
    },
    iconWrap: {
      width: 24,
      height: 24,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      backgroundColor: 'transparent',
    },
    iconWrapActive: {
      backgroundColor: withAlpha(primaryColor, '18'),
    },
    itemLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: inactiveText,
      textAlign: 'center',
    },
    itemLabelActive: {
      color: primaryColor,
      fontWeight: '800',
    },
  });

export default createStyles;
