import { Stack } from "expo-router";
import React from "react";

const NotificationStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"  />
        </Stack>
    );
}

export default NotificationStack;