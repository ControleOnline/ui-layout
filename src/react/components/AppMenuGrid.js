import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useStore} from '@store';
import createStyles, {withAlpha} from './AppMenuGrid.styles';

const normalizeMenus = menus =>
  (Array.isArray(menus) ? menus : [])
    .map(module => ({
      ...module,
      menus: Array.isArray(module?.menus) ? module.menus : [],
    }))
    .filter(module => module.menus.length > 0);

const resolveIconColor = (color, fallback) => {
  const tokenColor = String(color || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(tokenColor)) return tokenColor;
  return fallback;
};

const AppMenuGrid = ({
  emptyMessage = 'Nenhum menu disponivel.',
  menus,
  navigation,
  onMenuPress,
}) => {
  const {width} = useWindowDimensions();
  const themeStore = useStore('theme');
  const peopleStore = useStore('people');
  const {colors = {}} = themeStore.getters;
  const {currentCompany = {}} = peopleStore.getters;
  const modules = normalizeMenus(menus);

  const styles = useMemo(
    () =>
      createStyles({
        colors: {
          ...colors,
          ...(currentCompany?.theme?.colors || {}),
        },
        width,
      }),
    [colors, currentCompany?.id, width],
  );

  const handlePress = item => {
    if (typeof onMenuPress === 'function') {
      onMenuPress(item);
      return;
    }

    try {
      navigation?.navigate?.(item.route, item.routeParams || {});
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
      {modules.map(module => (
        <View key={module.id || module.label} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Icon
                name={module.icon || 'grid'}
                size={15}
                color={styles.palette.primary}
              />
            </View>
            <Text style={styles.sectionTitle}>
              {global.t?.t('menu', 'menu', module.label) || module.label}
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
                      {
                        backgroundColor: withAlpha(
                          resolveIconColor(item.color, styles.palette.primary),
                          '1F',
                        ),
                      },
                    ]}
                  >
                    <Icon
                      name={item.icon || 'circle'}
                      size={20}
                      color={resolveIconColor(item.color, styles.palette.primary)}
                    />
                  </View>
                  <Text numberOfLines={2} style={styles.cardLabel}>
                    {global.t?.t('menu', 'menu', item.menuKey)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default AppMenuGrid;
