import React, {useState, useCallback} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigationState} from '@react-navigation/native';
import {getStore} from '@store';

const BottomToolbar = ({navigation}) => {
  const state = useNavigationState(state => state);
  const activeTab = state.routes[state.index]?.name || 'HomePage';
  const {getters: configsGetters, actions: configActions} = getStore('configs');
  const {getters: peopleGetters} = getStore('people');
  const {getters} = getStore('theme');
  const {item: config} = configsGetters;
  const {colors} = getters;
  const {currentCompany} = peopleGetters;
  const [pdvType, setPdvType] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (config) setPdvType(config['pdv-type'] || 'full');
    }, [config]),
  );

  const styles = StyleSheet.create({
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 60,
      backgroundColor: '#f8f8f8',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 12,
      color: '#666',
      marginTop: 6,
    },
    activeText: {
      color: colors['primary'],
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.toolbar}>
      {config && pdvType && pdvType == 'full' ? (
        <TouchableOpacity
          style={styles.button}
          disabled={
            !currentCompany || Object.entries(currentCompany).length === 0
          }
          onPress={() => {
            navigation.navigate('HomePage');
          }}>
          <Icon
            name="home"
            size={15}
            color={activeTab === 'HomePage' ? '#007AFF' : '#666'}
          />
          <Text
            style={[
              styles.buttonText,
              activeTab === 'HomePage' && styles.activeText,
            ]}>
            Home
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          disabled={
            !currentCompany || Object.entries(currentCompany).length === 0
          }
          onPress={() => {
            navigation.navigate('CashRegisterIndex');
          }}>
          <Icon
            name="home"
            size={15}
            color={activeTab === 'CashRegisterIndex' ? '#007AFF' : '#666'}
          />
          <Text
            style={[
              styles.buttonText,
              activeTab === 'CashRegisterIndex' && styles.activeText,
            ]}>
            Caixa
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('SalesOrderIndex');
        }}
        disabled={
          !currentCompany || Object.entries(currentCompany).length === 0
        }>
        <Icon
          name="shopping-bag"
          size={15}
          color={activeTab === 'SalesOrderIndex' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.buttonText,
            activeTab === 'SalesOrderIndex' && styles.activeText,
          ]}>
          Pedidos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('ProfilePage');
        }}
        disabled={
          !currentCompany || Object.entries(currentCompany).length === 0
        }>
        <Icon
          name="user"
          size={15}
          color={activeTab === 'ProfilePage' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.buttonText,
            activeTab === 'ProfilePage' && styles.activeText,
          ]}>
          Perfil
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('SettingsPage');
        }}
        disabled={
          !currentCompany || Object.entries(currentCompany).length === 0
        }>
        <Icon
          name="settings"
          size={15}
          color={activeTab === 'SettingsPage' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.buttonText,
            activeTab === 'SettingsPage' && styles.activeText,
          ]}>
          Configurações
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default BottomToolbar;
