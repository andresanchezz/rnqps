import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

import KickoffStackNavigation from './app/navigation/kickoff-stack.navigation'

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <KickoffStackNavigation />
      </NavigationContainer>
    </SafeAreaView>
  )
}
