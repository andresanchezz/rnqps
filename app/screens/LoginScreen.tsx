import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { TextInput, Text, } from 'react-native-paper';
import { RootParamList } from '../models/root-param-list';
import AuthServices from '../services/AuthServices';
import { buttonStyles } from '../../styles/styles';
import * as SecureStore from 'expo-secure-store'; 
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';

// Tipo de navegación
type SplashScreenNavigationProp = StackNavigationProp<RootParamList, 'Splash'>;

export default function App() {
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

      const resp = await AuthServices.signIn({ username, password });

      if (resp.token) await SecureStore.setItemAsync('userToken', resp.token);
      if (resp.id) await SecureStore.setItemAsync('userId', resp.id);
      if (resp.role) await SecureStore.setItemAsync('userId', resp.id);
      
      navigation.push('Main');

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
          <Text style={{ textAlign: 'center', ...typography.headingLarge.black, color:colors.primary }}>
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

