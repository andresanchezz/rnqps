import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Toast from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'

// Pantallas
import SplashScreen from './app/screens/SplashScreen'
import LoginScreen from './app/screens/LoginScreen'
import WrapperScreen from './app/screens/WrapperScreen'


const Stack = createStackNavigator()

export default function App() {

  return (

    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={WrapperScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaView>

  )
}



