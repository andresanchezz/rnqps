import { KeyboardAvoidingView, Platform, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Text, } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { RootParamList } from '../../navigation/kickoff-stack.navigation';
import { AuthResponse } from '../../interfaces/auth/auth';
import { typography } from '../../../styles/typography';
import { apiServicesQPS } from '../../api/services-qps';
import { buttonStyles } from '../../../styles/styles';
import { colors } from '../../../styles/colors';

type SplashScreenNavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const LoginScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: 'error',
        text1: 'Empty fields',
        text2: 'Please fill in both the username and password',
      });
      return;
    }

    try {
      const { data: { token, email, id } } = await apiServicesQPS.post<AuthResponse>('/auth', {
        username,
        password
      });

      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userId', id);
      await SecureStore.setItemAsync('email', email);

      navigation.push('HomeStackNavigation');
    } catch (error) {
      //TODO: handle toast here!!!
    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, padding: 16 }}>

        <Image
          style={{ width: '100%', height: '35%' }}
          source={require('../../assets/adaptive-icon.png')}
        />

        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
          <Text style={{ textAlign: 'center', ...typography.headingLarge.black, color: colors.primary }}>
            Welcome back
          </Text>
          <View>
            <TextInput
              label="Email"
              value={username}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />
            <View style={{ height: 25 }}></View>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
            />
          </View>
          <TouchableOpacity style={buttonStyles.button} onPress={handleLogin}>
            <Text style={buttonStyles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

export default LoginScreen

