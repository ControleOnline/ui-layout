import React, { useState, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from '@controleonline/../../src/routers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@controleonline/ui-common/src/api';
import { DefaultProvider } from '@controleonline/ui-common/src/react/components/DefaultProvider';
import CheckLogin from '@controleonline/ui-login/src/react/components/CheckLogin';
import { PaperProvider } from 'react-native-paper';
import { MessageProvider } from '@controleonline/ui-common/src/react/components/MessageService';
import TouchFeedbackProvider from '@controleonline/ui-common/src/react/components/TouchFeedbackProvider';
import { VideoView, useVideoPlayer } from 'expo-video';

// Variáveis de controle
// ALEMAC // TODO // o mostrar ícone ainda não obedece
const MOSTRAR_ICONE = false;  // true = mostra ícone, false = esconde
const MOSTRAR_VIDEO = true;   // true = mostra vídeo, false = esconde

export default function App() {
  const [navigationReady, setNavigationReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  const player = useVideoPlayer(
    showSplash && MOSTRAR_VIDEO ? require('@controleonline/../../src/assets/splash-video.mp4') : null,
    player => {
      if (player) {
        player.loop = false;
        player.play();
        setPlayerReady(true);
      }
    }
  );

  useEffect(() => {
    global.api = api;
  }, []);

  useEffect(() => {
    if (playerReady || !MOSTRAR_VIDEO) {
      const timer = setTimeout(() => setShowSplash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [playerReady]);

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {MOSTRAR_ICONE && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Aqui coloca o teu ícone/logo */}
          </View>
        )}
        {MOSTRAR_VIDEO && playerReady && (
          <VideoView
            player={player}
            allowsFullscreen={false}
            style={{ flex: 1 }}
          />
        )}
      </View>
    );
  }

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