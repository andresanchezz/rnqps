import { create } from "zustand";

interface AuthStore {
    token: string;
    role: string;
    setToken(token: string): void;
    setRole(role: string): void;
}

interface HomeStore {
    isLoading: boolean;
    setIsLoading(isLoading: boolean): void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: "",
    role: "",
    setToken: (token: string) => set((_) => ({ token })),
    setRole: (role: string) => set((_) => ({ role })),
}));

const useHomeStore = create<HomeStore>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading: boolean) => set((_) => ({ isLoading })),
}));

export {
    useAuthStore,
    useHomeStore
};
