import { KeyboardAvoidingView, Platform, ScrollView, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Text, } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import useLoginScreenHook from './hooks/useLoginScreen.hook';

import { RootParamList } from '../../navigation/kickoff-stack.navigation';
import { buttonStyles } from '../../../styles/styles';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '../../components/LoadingButton';

export type LoginScreenNavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const LoginScreen = () => {

  const { t } = useTranslation();

  const { username, setEmail, password, setPassword, handleLogin } = useLoginScreenHook();

  return (

    <KeyboardAvoidingView
      style={styles.mainView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 30 }}>

        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <View>

            <Image
              style={{ width: '90%', height: '40%' }}
              source={require('../../../assets/logoqps.png')}
            />
            <View style={{ height: 35 }}></View>
            <TextInput
              label={t('email')}
              value={username}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />
            <View style={{ height: 15 }}></View>
            <TextInput
              label={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
            />
            <View style={{ height: 25 }}></View>
            <LoadingButton label='Sign in' onPress={handleLogin} />
          </View>


        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

export default LoginScreen

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#f6ffff'
  }
})