import { create } from "zustand";
import { DataCleaner } from "../interfaces/user/userById";

interface AuthStore {
    token: string;
    role: string;
    user: DataCleaner | null;
    setToken(token: string): void;
    setRole(role: string): void;
    setUser(user: DataCleaner): void;
    signOut(): void;
}

interface HomeStore {
    isLoading: boolean;
    setIsLoading(isLoading: boolean): void;
}
interface LoadingStore {
    isLoading: boolean;
    setIsLoading(isLoading: boolean): void;
}


const useAuthStore = create<AuthStore>((set) => ({
    token: "",
    role: "",
    user: null,
    setToken: (token: string) => set((_) => ({ token })),
    setRole: (role: string) => set((_) => ({ role })),
    setUser: (user: DataCleaner) => set((_) => ({ user })),
    signOut: () => {
        set({ token: "" });
    },
}));

const useHomeStore = create<HomeStore>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading: boolean) => set((_) => ({ isLoading })),
}));

const useLoadingStore = create<LoadingStore>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set((_) => ({ isLoading })),
}));

export {
    useAuthStore,
    useHomeStore,
    useLoadingStore
};
