import React from "react";
import { ActivityIndicator } from "react-native";
import { BaseToast } from "react-native-toast-message";

export const LoadingToast = (props: any) => {
    return (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#3498db' }}
            text1Style={{ fontSize: 16, fontWeight: '400' }}
            text2Style={{ fontSize: 14, color: 'gray' }}
            renderLeadingIcon={() => (
                <ActivityIndicator size="small" color="#3498db" style={{ marginHorizontal: 10 }} />
            )}
        />
    )
};

export const toastConfig = {
    loading: (props: any) => <LoadingToast {...props} />,
};