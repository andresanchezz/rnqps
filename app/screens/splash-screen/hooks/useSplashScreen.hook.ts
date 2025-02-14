import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { useAuthStore, useHomeStore } from '../../../state';
import * as Sentry from "@sentry/react-native";

const useSplashScreenHook = () => {

    const { setIsLoading } = useHomeStore();
    const { setToken } = useAuthStore();

    const isAuthenticated = async () => {

        try {
            const userToken = await SecureStore.getItemAsync("userToken");

            if (userToken ) {
                setToken(userToken); 
            }

            setIsLoading(false);

        } catch (error:any) {
            Sentry.captureMessage(error)
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        isAuthenticated();
    }, []);
};

export default useSplashScreenHook;