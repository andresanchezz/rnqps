import { HTTP } from "../api/services-qps";
import { handleApiErrors } from "../utils/error-handler";
import * as SecureStore from 'expo-secure-store';

export default class UsersServices {

    public static async getUserInf(id: string) {
        return await handleApiErrors(() => HTTP.get(`/users/${id}`,))
    }

    public static async signOut() {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('userInfo');



    }

}