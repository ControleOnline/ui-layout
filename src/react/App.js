import React, { useState, useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from '@controleonline/../../src/routers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@controleonline/ui-common/src/api';
import { DefaultProvider } from '@controleonline/ui-common/src/react/components/DefaultProvider';
import CheckLogin from '@controleonline/ui-login/src/react/components/CheckLogin';
import { PaperProvider } from 'react-native-paper';
import { MessageProvider } from '@controleonline/ui-common/src/react/components/MessageService';
import TouchFeedbackProvider from '@controleonline/ui-common/src/react/components/TouchFeedbackProvider';



export default function App() {
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    global.api = api;
  }, []);
  
  return (
    <PaperProvider>
      <TouchFeedbackProvider>
        <MessageProvider>
          <DefaultProvider>
            <NavigationContainer onReady={() => setNavigationReady(true)}>
              <StatusBar
                barStyle={'light-content'}
                backgroundColor={'#1B5587'}
              />
              {navigationReady && <CheckLogin />}
              <Routes />
            </NavigationContainer>
          </DefaultProvider>
        </MessageProvider>
      </TouchFeedbackProvider>
    </PaperProvider>

  );
}
