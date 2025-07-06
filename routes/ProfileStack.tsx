import { Stack } from "expo-router";
import React from "react";

const ProfileStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="order" />
            <Stack.Screen name="favourite" />
            <Stack.Screen name="policy" />
            <Stack.Screen name="help-center" />
        </Stack>
    );
}

export default ProfileStack;