import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

import KickoffStackNavigation from './app/navigation/kickoff-stack.navigation'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18next'
import Toast from 'react-native-toast-message'

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <KickoffStackNavigation />
      </NavigationContainer>
      <Toast />
    </SafeAreaView>
    </I18nextProvider>
  )
}
