import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
}

export const getLanguage = async () => {
    return await AsyncStorage.getItem("language");
}