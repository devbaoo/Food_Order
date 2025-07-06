
import React from "react"
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native"

const BackgroundLoading2 = ({ style }: { style?: ViewStyle }) => {
    return (
        <View
            style={[{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "rgba(0, 0, 0, 0.1)",
            }, StyleSheet.absoluteFillObject, style]}
        >
            <ActivityIndicator size="large" color="red" />
        </View>
    )
}

export default BackgroundLoading2;