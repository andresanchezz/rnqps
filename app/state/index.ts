import { create } from "zustand";
import { UserById } from "../interfaces/user/userById";

interface AuthStore {
    token: string;
    role: string;
    user: UserById | null;
    setToken(token: string): void;
    setRole(role: string): void;
    setUser(user: UserById): void;
}

interface HomeStore {
    isLoading: boolean;
    setIsLoading(isLoading: boolean): void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: "",
    role: "",
    user: null,
    setToken: (token: string) => set((_) => ({ token })),
    setRole: (role: string) => set((_) => ({ role })),
    setUser: (user: UserById) => set((_) => ({ user }))
}));

const useHomeStore = create<HomeStore>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading: boolean) => set((_) => ({ isLoading })),
}));

export {
    useAuthStore,
    useHomeStore
};
