import React, {useMemo} from 'react';
import {Modal, Pressable, Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
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

const AppMenuGrid = ({
  colorTokens = {},
  emptyMessage = 'Nenhum menu disponivel.',
  menus,
  navigation,
  menuType = 'home',
  onMenuPress,
  operationInfo = null,
  operationModuleId = null,
}) => {
  const [isInfoVisible, setIsInfoVisible] = React.useState(false);
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
  const operationRows = useMemo(
    () =>
      Array.isArray(operationInfo)
        ? operationInfo
        : Object.entries(operationInfo || {}).map(([label, value]) => ({
            key: label,
            label,
            value,
          })),
    [operationInfo],
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
              {operationModuleId !== null &&
              operationModuleId !== undefined &&
              String(module.id) === String(operationModuleId) &&
              operationRows.length > 0 ? (
                <Pressable
                  accessibilityLabel="Ver configuração da operação"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => setIsInfoVisible(true)}
                  style={styles.infoButton}
                  testID={`operation-info-button:${module.id}`}>
                  <Icon
                    name="info"
                    size={14}
                    color={styles.palette.sectionTone.foreground}
                  />
                </Pressable>
              ) : null}
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
                    <Text numberOfLines={2} style={styles.cardLabel}>
                      {resolveRuntimeMenuLabel(item, translate)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
      {operationRows.length > 0 ? (
        <Modal
          animationType="fade"
          onRequestClose={() => setIsInfoVisible(false)}
          transparent
          visible={isInfoVisible}>
          <Pressable
            onPress={() => setIsInfoVisible(false)}
            style={styles.modalBackdrop}
            testID="operation-info-backdrop">
            <Pressable
              accessibilityLabel="Configuração do PDV"
              accessibilityRole="summary"
              onPress={event => event.stopPropagation()}
              style={styles.infoModal}
              testID="operation-info-dialog">
              <View style={styles.infoModalHeader}>
                <Text style={styles.infoModalTitle}>Configuração do PDV</Text>
                <Pressable
                  accessibilityLabel="Fechar configuração do PDV"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => setIsInfoVisible(false)}>
                  <Text style={styles.infoModalClose}>×</Text>
                </Pressable>
              </View>
              {operationRows.map(row => (
                <View key={row.key || row.label} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>
                    {String(row.value ?? 'Não configurado')}
                  </Text>
                </View>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
};

export default AppMenuGrid;
