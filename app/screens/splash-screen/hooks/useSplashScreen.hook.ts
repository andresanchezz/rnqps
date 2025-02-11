import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

import { useAuthStore, useHomeStore } from '../../../state';

const useSplashScreenHook = () => {
    const { setIsLoading } = useHomeStore()
    const { setToken } = useAuthStore()
    const isAuthenticated = async () => {
        const userToken = SecureStore.getItem("userToken")

        setIsLoading(false)

        if (!userToken) {
            return
        }

        setToken(userToken)
    };

    useEffect(() => {
        isAuthenticated();
    }, []);
}

export default useSplashScreenHook