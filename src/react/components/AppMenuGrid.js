import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useStore} from '@store';
import {
  filterRuntimeMenuModulesByType,
  resolveRuntimeMenuLabel,
} from '@controleonline/ui-common/src/react/utils/runtimeMenu';
import {
  resolveMenuRouteName,
  resolveMenuRouteParams,
} from '@controleonline/ui-layout/src/react/utils/menuNavigation';
import createStyles from './AppMenuGrid.styles';

const COMPACT_MENU_LABELS = new Set(['viewProspects', 'financialReport']);

const shouldUseCompactCardLabel = item => {
  const candidates = [
    item?.menuKey,
    item?.menu_key,
    item?.id,
    item?.label,
    item?.route,
  ];
  return candidates.some(value =>
    COMPACT_MENU_LABELS.has(String(value || '').trim()),
  );
};

const AppMenuGrid = ({
  colorTokens = {},
  emptyMessage = 'Nenhum menu disponivel.',
  menus,
  navigation,
  menuType = 'home',
  onMenuPress,
}) => {
  const {width} = useWindowDimensions();
  const themeStore = useStore('theme');
  const peopleStore = useStore('people');
  const translateStore = useStore('translate');
  const {colors = {}} = themeStore.getters;
  const {currentCompany = {}} = peopleStore.getters;
  const translateMessages = translateStore?.getters?.messages || {};
  const pendingTranslateMessages = translateStore?.getters?.pendingMessages || {};
  const translate = useMemo(
    () => global.t?.t,
    [translateMessages, pendingTranslateMessages],
  );
  const modules = useMemo(
    () => filterRuntimeMenuModulesByType(menus, menuType),
    [menuType, menus],
  );

  const styles = useMemo(
    () =>
      createStyles({
        colors: {
          ...colors,
          ...(currentCompany?.theme?.colors || {}),
          ...colorTokens,
        },
        width,
      }),
    [colorTokens, colors, currentCompany?.id, width],
  );

  const handlePress = item => {
    if (typeof onMenuPress === 'function') {
      onMenuPress(item);
      return;
    }

    const routeName = resolveMenuRouteName(item?.route);

    if (!routeName) {
      return;
    }

    try {
      navigation?.navigate?.(
        routeName,
        resolveMenuRouteParams(item?.routeParams),
      );
    } catch {
      // The route can be absent in a specific app flavor.
    }
  };

  if (modules.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {modules.map(module => {
        return (
          <View key={module.id || module.label} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIcon,
                  {backgroundColor: styles.palette.sectionTone.background},
                ]}>
                <Icon
                  name={module.icon || 'grid'}
                  size={15}
                  color={styles.palette.sectionTone.foreground}
                />
              </View>
              <Text style={styles.sectionTitle}>
                {translate?.('menu', 'menu', module.label) || module.label}
              </Text>
            </View>

            <View style={styles.grid}>
              {module.menus.map(item => (
                <TouchableOpacity
                  key={item.id || item.menuKey || item.route}
                  activeOpacity={0.82}
                  style={styles.cardOuter}
                  onPress={() => handlePress(item)}
                >
                  <View style={styles.card}>
                    <View
                      style={[
                        styles.cardIcon,
                        {backgroundColor: styles.palette.segmentTone.background},
                      ]}
                    >
                      <Icon
                        name={item.icon || 'circle'}
                        size={20}
                        color={styles.palette.segmentTone.foreground}
                      />
                    </View>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.cardLabel,
                        shouldUseCompactCardLabel(item) && styles.cardLabelCompact,
                      ]}
                    >
                      {resolveRuntimeMenuLabel(item, translate)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AppMenuGrid;
