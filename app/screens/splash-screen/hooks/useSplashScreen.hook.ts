import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

import { useAuthStore, useHomeStore } from '../../../state';

const useSplashScreenHook = async () => {
 
    const { setIsLoading } = useHomeStore();
    const { setToken } = useAuthStore();
    
    const isAuthenticated = async () => {
        try {
            // Await the SecureStore.getItem call to ensure the token is retrieved
            const userToken = SecureStore.getItem("userToken");

            // Update loading state
            setIsLoading(false);

            // If a token exists, update the token state
            if (userToken) {
                setToken(userToken);
            }
        } catch (error) {
            console.error('Failed to retrieve user token:', error);
            setIsLoading(false); // Ensure loading state is updated even if an error occurs
        }
    };

    useEffect(() => {
        isAuthenticated();
    }, []);
};

export default useSplashScreenHook;