import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import * as SecureStore from 'expo-secure-store'; // Importa SecureStore para obtener el token

class ServicesQps {
  private api: AxiosInstance;

  constructor(
    private applyInterceptor: boolean = true,
    private isAppJson: boolean = true
  ) {
    this.api = axios.create({
      baseURL: "https://api.servicesqps.com",
      headers: {
        "Content-Type": this.isAppJson
          ? "application/json"
          : "multipart/form-data",
      },
    });

    if (this.applyInterceptor) {
      this.setupInterceptors();
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('userToken'); // Obtén el token desde SecureStore
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  }

  private setupInterceptors() {
    // Interceptor para agregar el token a las solicitudes
    this.api.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const token = await this.getToken(); // Obtén el token
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`, // Agrega el token al header
          };
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores globales
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.error("No autorizado. Redirigir a login...");
          // Aquí podrías redirigir al login o eliminar el token
          SecureStore.deleteItemAsync('userToken'); // Elimina el token si la solicitud no está autorizada
          // Redirige al usuario a la pantalla de inicio de sesión
          // Ejemplo: navigation.navigate('Login');
        }
        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.api;
  }
}

export const HTTP = new ServicesQps().getInstance(); // Instancia con interceptores
export const HTTPNT = new ServicesQps(false).getInstance(); // Instancia sin interceptores