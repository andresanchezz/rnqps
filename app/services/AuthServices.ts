import { HTTPNT } from "../api/services-qps";
import LoginCredentials from "../models/login-credentials";
import { handleApiErrors } from "../utils/error-handler";

export default class AuthServices {

    public static async signIn(credentials: LoginCredentials) {
        return await handleApiErrors(() => HTTPNT.post('/auth', credentials))
    }

}