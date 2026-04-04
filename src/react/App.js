import React, { useState, useEffect } from 'react'
import { StatusBar, View, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Routes, { linking } from '@controleonline/../../src/routers'
import { api } from '@controleonline/ui-common/src/api'
import { DefaultProvider } from '@controleonline/ui-common/src/react/components/DefaultProvider'
import CheckLogin from '@controleonline/ui-login/src/react/components/CheckLogin'
import { PaperProvider } from 'react-native-paper'
import { MessageProvider } from '@controleonline/ui-common/src/react/components/MessageService'
import {
  TOAST_EXTRA_INSETS,
  TOAST_PROVIDER_KEYS,
} from '@controleonline/ui-common/src/react/components/toastConfig'
import TouchFeedbackProvider from '@controleonline/ui-common/src/react/components/TouchFeedbackProvider'
import { VideoView, useVideoPlayer } from 'expo-video'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { toast, Toasts } from '@backpackapp-io/react-native-toast'
import { env } from '@env'

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
  const [bootstrapReady, setBootstrapReady] = useState(false)
  const [videoEnded, setVideoEnded] = useState(!MOSTRAR_VIDEO)
  const shouldShowSplash = !bootstrapReady || !videoEnded
  const appType = String(env.APP_TYPE || '').toUpperCase()
  const shouldLockWebViewportToApp =
    Platform.OS === 'web' && (appType === 'SHOP' || appType === 'DELIVERY')

  const player = useVideoPlayer(
    shouldShowSplash && MOSTRAR_VIDEO && !videoEnded ? splashVideo : null,
    player => {
      if (!player) return

      player.loop = false
      player.play()

      const sub = player.addListener('ended', () => {
        setVideoEnded(true)
      })

      return () => sub?.remove?.()
    }
  )

  useEffect(() => {
    global.api = api

    if (!MOSTRAR_VIDEO) {
      setVideoEnded(true)
    }
  }, [])

  useEffect(() => {
    if (!shouldLockWebViewportToApp || typeof document === 'undefined') {
      return
    }

    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')

    const previous = {
      htmlHeight: html.style.height,
      htmlWidth: html.style.width,
      htmlOverflow: html.style.overflow,
      bodyHeight: body.style.height,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyMargin: body.style.margin,
      rootHeight: root?.style.height || '',
      rootWidth: root?.style.width || '',
      rootOverflow: root?.style.overflow || '',
    }

    html.style.height = '100%'
    html.style.width = '100%'
    html.style.overflow = 'hidden'

    body.style.height = '100%'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    body.style.margin = '0'

    if (root) {
      root.style.height = '100%'
      root.style.width = '100%'
      root.style.overflow = 'hidden'
    }

    return () => {
      html.style.height = previous.htmlHeight
      html.style.width = previous.htmlWidth
      html.style.overflow = previous.htmlOverflow

      body.style.height = previous.bodyHeight
      body.style.width = previous.bodyWidth
      body.style.overflow = previous.bodyOverflow
      body.style.margin = previous.bodyMargin

      if (root) {
        root.style.height = previous.rootHeight
        root.style.width = previous.rootWidth
        root.style.overflow = previous.rootOverflow
      }
    }
  }, [shouldLockWebViewportToApp])

  return (
    <GestureHandlerRootView style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
      <PaperProvider>
        <TouchFeedbackProvider>
          <MessageProvider>
            <DefaultProvider onBootstrapReady={() => setBootstrapReady(true)}>
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
                <Toasts
                  providerKey={TOAST_PROVIDER_KEYS.ROOT}
                  extraInsets={TOAST_EXTRA_INSETS}
                  onToastPress={currentToast => toast.dismiss(currentToast.id)}
                />
              </NavigationContainer>
            </DefaultProvider>
          </MessageProvider>
        </TouchFeedbackProvider>

        {shouldShowSplash && (
          <View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: '#000',
          }}>
            {MOSTRAR_ICONE && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            )}

            {MOSTRAR_VIDEO && !videoEnded && (
              <VideoView
                player={player}
                allowsFullscreen={false}
                style={{ flex: 1 }}
              />
            )}
          </View>
        )}
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
