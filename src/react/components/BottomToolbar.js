import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigationState} from '@react-navigation/native';
import {useTheme} from '@controleonline/ui-layout/src/react/components/ThemeProvider';

const BottomToolbar = ({navigation}) => {
  // Estado para rastrear a aba ativa
  const state = useNavigationState(state => state);
  const activeTab = state.routes[state.index]?.name || 'HomePage';
  const {colors} = useTheme();

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
      <TouchableOpacity
        style={styles.button}
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('SalesOrderIndex');
        }}>
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
        }}>
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
        }}>
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
