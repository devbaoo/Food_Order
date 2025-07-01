
import React from "react"
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native"

const BackgroundLoading2 = ({ style }: { style?: ViewStyle }) => {
    return (
        <View
            style={[{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "white",
            }, StyleSheet.absoluteFillObject, style]}
        >
            <ActivityIndicator size="large" color="red" />
        </View>
    )
}

export default BackgroundLoading2;