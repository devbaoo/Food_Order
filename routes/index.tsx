import { Stack } from "expo-router";
import React from "react";

const AppNavigator: React.FC = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AppNavigator;
