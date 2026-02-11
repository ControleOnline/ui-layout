import React, { useState, useEffect } from 'react'
import { StatusBar, View, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Routes, { linking } from '@controleonline/../../src/routers'
import { api } from '@controleonline/ui-common/src/api'
import { DefaultProvider } from '@controleonline/ui-common/src/react/components/DefaultProvider'
import CheckLogin from '@controleonline/ui-login/src/react/components/CheckLogin'
import { PaperProvider } from 'react-native-paper'
import { MessageProvider } from '@controleonline/ui-common/src/react/components/MessageService'
import TouchFeedbackProvider from '@controleonline/ui-common/src/react/components/TouchFeedbackProvider'
import { VideoView, useVideoPlayer } from 'expo-video'

const MOSTRAR_ICONE = false
let MOSTRAR_VIDEO = Platform.OS !== 'web'

let splashVideo = null

if (MOSTRAR_VIDEO) {
  try {
    splashVideo = require('@controleonline/../../src/assets/splash-video.mp4')
  } catch {
    splashVideo = null
    MOSTRAR_VIDEO = false
  }
}

export default function App() {
  const [navigationReady, setNavigationReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  const player = useVideoPlayer(
    showSplash && MOSTRAR_VIDEO ? splashVideo : null,
    player => {
      if (!player) return

      player.loop = false
      player.play()

      const sub = player.addListener('ended', () => {
        setShowSplash(false)
      })

      return () => sub?.remove?.()
    }
  )

  useEffect(() => {
    global.api = api

    if (!MOSTRAR_VIDEO) {
      setShowSplash(false)
    }
  }, [])

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {MOSTRAR_ICONE && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        )}

        {MOSTRAR_VIDEO && (
          <VideoView
            player={player}
            allowsFullscreen={false}
            style={{ flex: 1 }}
          />
        )}
      </View>
    )
  }

  return (
    <PaperProvider>
      <TouchFeedbackProvider>
        <MessageProvider>
          <DefaultProvider>
            <NavigationContainer
              linking={linking}
              onReady={() => setNavigationReady(true)}
            >
              <StatusBar
                barStyle="light-content"
                backgroundColor="#1B5587"
              />

              {navigationReady && <CheckLogin />}
              <Routes />
            </NavigationContainer>
          </DefaultProvider>
        </MessageProvider>
      </TouchFeedbackProvider>
    </PaperProvider>
  )
}
