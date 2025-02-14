import { KeyboardAvoidingView, Platform, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Text, } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import useLoginScreenHook from './hooks/useLoginScreen.hook';

import { RootParamList } from '../../navigation/kickoff-stack.navigation';
import { typography } from '../../../styles/typography';
import { buttonStyles } from '../../../styles/styles';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';

export type LoginScreenNavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const LoginScreen = () => {

  const { t } = useTranslation();

  const { username, setEmail, password, setPassword, handleLogin } = useLoginScreenHook();

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>

        <Image
          style={{ width: '100%', height: '35%' }}
          source={require('../../../assets/adaptive-icon.png')}
        />

        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
          <Text style={{ textAlign: 'center', ...typography.headingLarge.black, color: colors.primary }}>
          {t('welcome')}
          </Text>
          <View>
            <TextInput
              label={t('email')}
              value={username}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />
            <View style={{ height: 25 }}></View>
            <TextInput
              label={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
            />
          </View>
          <TouchableOpacity style={buttonStyles.button} onPress={handleLogin}>
            <Text style={buttonStyles.buttonText}>{t('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

export default LoginScreen

