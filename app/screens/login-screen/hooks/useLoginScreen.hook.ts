import * as SecureStore from 'expo-secure-store';
import * as Sentry from "@sentry/react-native";
import Toast from 'react-native-toast-message';

import { AuthResponse } from '../../../interfaces/auth/auth';
import { apiServicesQPS } from '../../../api/services-qps';
import { useState } from 'react';
import { useAuthStore } from '../../../state';
import { UserById } from '../../../interfaces/user/userById';

const useLoginScreenHook = () => {

  const { setToken, setUser } = useAuthStore();
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

      await fetchUserInfo(id, token);

      setToken(token);

    } catch (error: any) {
      
      Toast.show({
        type: 'error',
        text1: error.response.data.error,
        text2: error.response.data.message
      })

       Sentry.captureMessage(error) 
    }
  };

  const fetchUserInfo = async (id: string, token: string) => {
    try {
      const { data } = await apiServicesQPS.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      SecureStore.setItem('userData', JSON.stringify(data));

    } catch (error: any) {
      console.log('Error fetching user info:', error);
      Sentry.captureMessage(error);
    }
  };


  return {
    handleLogin,
    username,
    password,
    setEmail,
    setPassword,
  }
}

export default useLoginScreenHook