import {StyleSheet} from 'react-native';

export const withAlpha = (color, alphaHex) => {
  const raw = String(color || '').replace('#', '').trim();
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw}${alphaHex}`;
  return color || '#2563EB';
};

export default function createStyles({colors = {}, width = 1024}) {
  const palette = {
    primary: colors.primary || '#2563EB',
    surface: colors.cardBackground || colors.surface || colors.background || '#FFFFFF',
    background: colors.pageBackground || colors.background || '#F8FAFC',
    border: colors.cardBorder || colors.border || '#D8E0EA',
    text: colors.textPrimary || colors.text || '#0F172A',
    muted: colors['text-muted'] || '#64748B',
  };
  const hasCompanySegmentTheme = Boolean(
    colors.buttonBackground && colors.buttonText,
  );
  const actionBackground = colors.buttonBackground || palette.primary;
  const actionText = colors.buttonText || palette.surface;

  palette.hasCompanySegmentTheme = hasCompanySegmentTheme;
  palette.sectionTone = {
    background: actionBackground,
    foreground: actionText,
  };
  palette.segmentTones = [
    {background: actionText, foreground: actionBackground},
    {background: actionText, foreground: actionBackground},
    {background: actionText, foreground: actionBackground},
    {background: actionText, foreground: actionBackground},
  ];

  const isCompact = width < 700;
  const gap = isCompact ? 10 : 12;
  const columns = width < 520 ? 2 : width < 980 ? 3 : 4;
  const cardWidth = `${100 / columns}%`;

  return {
    palette,
    ...StyleSheet.create({
      wrapper: {
        gap: 18,
      },
      section: {
        gap: 12,
      },
      sectionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 9,
      },
      sectionIcon: {
        alignItems: 'center',
        backgroundColor: withAlpha(palette.primary, '14'),
        borderRadius: 6,
        height: 28,
        justifyContent: 'center',
        width: 28,
      },
      sectionTitle: {
        color: palette.text,
        fontSize: isCompact ? 15 : 16,
        fontWeight: '800',
      },
      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -gap / 2,
        rowGap: gap,
      },
      cardOuter: {
        flexBasis: cardWidth,
        maxWidth: cardWidth,
        minWidth: cardWidth,
        paddingHorizontal: gap / 2,
      },
      card: {
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'flex-start',
        minHeight: 80,
        padding: 12,
        shadowColor: palette.text,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      cardIcon: {
        alignItems: 'center',
        borderRadius: 8,
        height: 38,
        justifyContent: 'center',
        width: 38,
      },
      cardLabel: {
        color: palette.text,
        flex: 1,
        fontSize: isCompact ? 13 : 14,
        fontWeight: '700',
        lineHeight: isCompact ? 17 : 18,
        textAlign: 'left',
      },
      emptyBox: {
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 22,
      },
      emptyText: {
        color: palette.muted,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
      },
    }),
  };
}
