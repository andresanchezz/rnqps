import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootParamList } from '../models/root-param-list';
import { StackNavigationProp } from '@react-navigation/stack';

type SplashScreenNavigationProp = StackNavigationProp<RootParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const userLoggedIn = await checkIfUserIsLoggedIn();
      setIsLoggedIn(userLoggedIn);
    };

    checkAuthStatus();
  }, []);


  useEffect(() => {
    if (isLoggedIn !== null) {

      if (isLoggedIn) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }
  }, [isLoggedIn, navigation]);


  if (isLoggedIn === null) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

const checkIfUserIsLoggedIn = async () => {

  return false;
  
};

export default SplashScreen;
