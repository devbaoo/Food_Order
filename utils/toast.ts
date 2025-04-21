import Toast from 'react-native-toast-message';

const duration = 5000;

export const toast = {
    success: (title?: string, msg?: string, timeout = duration) =>
        Toast.show({
            type: 'success',
            text1: title,
            text2: msg,
            visibilityTime: timeout,
        }),
    error: (title?: string, msg?: string, timeout = duration) =>
        Toast.show({
            type: 'error',
            text1: title,
            text2: msg,
            visibilityTime: timeout,
        }),
    info: (title?: string, msg?: string, timeout = duration) =>
        Toast.show({
            type: 'info',
            text1: title,
            text2: msg,
            visibilityTime: timeout,
        }),
};
