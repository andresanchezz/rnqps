import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

import KickoffStackNavigation from './app/navigation/kickoff-stack.navigation'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18next'
import Toast from 'react-native-toast-message'
import { DefaultTheme, PaperProvider } from 'react-native-paper'

export default function App() {

  const lightTheme = {
    ...DefaultTheme,
    dark: false, 
    colors: {
      ...DefaultTheme.colors,
      background: 'white', 
      surface: 'white', 
      text: 'black', 
    },
  };

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaView style={{ flex: 1 }}>
        <PaperProvider theme={lightTheme}>
          <NavigationContainer>
            <KickoffStackNavigation />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaView>
      <Toast />
    </I18nextProvider>
  )
}
