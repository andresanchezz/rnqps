import * as SecureStore from 'expo-secure-store';
import * as Sentry from "@sentry/react-native";
import Toast from 'react-native-toast-message';

import { AuthResponse } from '../../../interfaces/auth/auth';
import { apiServicesQPS } from '../../../api/services-qps';
import { LoginScreenNavigationProp } from '../LoginScreen';
import { useNavigation } from '@react-navigation/native';
import { useId, useState } from 'react';
import { useAuthStore } from '../../../state';
import { UserById } from '../../../interfaces/user/userById';

const useLoginScreenHook = () => {

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setToken, setUser } = useAuthStore()
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
        username: username,
        password: password,
      });

      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userId', id);
      await SecureStore.setItemAsync('email', email);

      setToken(token)

      await fetchUserInfo(id);

    } catch (error: any) {
      Sentry.captureMessage(error)
    }
  };

  const fetchUserInfo = async (userId: string) => {

    try {
      const { data } = await apiServicesQPS.get<UserById>(`/users/${userId}`);
      setUser(data)

    } catch (error: any) {
      Sentry.captureMessage(error)
    }

  }


  return {
    handleLogin,
    username,
    password,
    setEmail,
    setPassword,
  }
}

export default useLoginScreenHook