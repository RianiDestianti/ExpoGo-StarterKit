import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const TOKEN_KEY = "auth-key"

// SecureStore (terenkripsi) di Android/iOS, localStorage di web karena SecureStore tidak mendukung web.
export const getToken = async (): Promise<string | null> => {
    if (Platform.OS === "web") {
        return localStorage.getItem(TOKEN_KEY)
    }
    return SecureStore.getItemAsync(TOKEN_KEY)
}

export const setToken = async (token: string) => {
    if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, token)
        return
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export const removeToken = async () => {
    if (Platform.OS === "web") {
        localStorage.removeItem(TOKEN_KEY)
        return
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY)
}
