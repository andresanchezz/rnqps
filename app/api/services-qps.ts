import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import { useAuthStore } from '../state';

export const apiServicesQPS = axios.create({
  baseURL: "https://api.servicesqps.com"
})

apiServicesQPS.interceptors.request.use(async function (config) {
  const { token } = useAuthStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
}, function (error) {
  if (error.response) {
    //TODO: here it means we should handle a toast
  }
  return Promise.reject(error)
})

apiServicesQPS.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  if (error.response) {
    await SecureStore.deleteItemAsync('userToken');
  }
  return Promise.reject(error)
})
