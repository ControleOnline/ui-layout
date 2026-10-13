import {StyleSheet} from 'react-native';

export default function createSoftStyles({colors, width}) {
  const mobile = width < 700;
  const narrow = width < 381;
  const columns = narrow ? 1 : width < 700 ? 2 : width < 980 ? 3 : 4;
  const gap = mobile ? 8 : 12;
  const size = `${100 / columns}%`;
  return {
    showChevron: !mobile || narrow,
    iconSize: mobile ? 17 : 20,
    palette: {
      text: colors.textPrimary,
      muted: colors.textMuted,
      sectionTone: {background: colors.iconBackground, foreground: colors.iconColor},
      segmentTone: {background: colors.cardIconBackground, foreground: colors.cardIconColor},
    },
    ...StyleSheet.create({
      wrapper: {gap: mobile ? 19 : 28},
      section: {gap: mobile ? 10 : 13},
      sectionHeader: {alignItems: 'center', flexDirection: 'row', gap: 9},
      sectionIcon: {width: 28, height: 28, borderRadius: 9, borderWidth: 1,
        borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center'},
      sectionTitle: {fontSize: 15, fontWeight: '600', color: colors.textPrimary},
      sectionDivider: {height: 1, flex: 1, backgroundColor: colors.cardBorder, marginLeft: 6},
      grid: {flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2, rowGap: gap},
      cardOuter: {flexBasis: size, maxWidth: size, minWidth: size, paddingHorizontal: gap / 2},
      card: {flexDirection: 'row', alignItems: 'center', minHeight: narrow ? 64 : mobile ? 80 : 90,
        justifyContent: 'flex-start',
        padding: mobile ? 11 : 16, gap: mobile ? 7 : 12,
        borderRadius: 14, borderWidth: 1, borderColor: colors.cardBorder,
        backgroundColor: colors.cardBackground, shadowColor: colors.textPrimary,
        shadowOpacity: 0.035, shadowRadius: 8, shadowOffset: {width: 0, height: 3}},
      cardIcon: {alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        width: mobile ? 28 : 40, height: mobile ? 28 : 40, borderRadius: mobile ? 9 : 12},
      cardLabel: {color: colors.textPrimary, flex: 1,
        flexShrink: 1, minWidth: 0, fontWeight: '600',
        fontSize: mobile && !narrow ? 12.5 : 13, lineHeight: 18, textAlign: 'left'},
      cardChevron: {opacity: 0.55},
      cardHighlighted: {borderColor: colors.homeHoverBorder || colors.cardIconColor},
      cardChevronHighlighted: {opacity: 1},
      cardPressed: {backgroundColor: colors.cardIconBackground},
      emptyBox: {alignItems: 'center', padding: 24, borderWidth: 1, borderRadius: 14,
        borderColor: colors.cardBorder, backgroundColor: colors.cardBackground},
      emptyText: {color: colors.textMuted, fontSize: 14, textAlign: 'center'},
    }),
  };
}
