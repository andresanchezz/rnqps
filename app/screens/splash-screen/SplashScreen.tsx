import { View, ActivityIndicator } from 'react-native';
import React from 'react';

import useSplashScreenHook from './hooks/useSplashScreen.hook';

const SplashScreen = () => {
  
  useSplashScreenHook()

  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

export default SplashScreen;
