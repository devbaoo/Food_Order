import { Stack } from "expo-router";
import React from "react";

const ProfileStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"  />
            <Stack.Screen name="order"  />
            <Stack.Screen name="favourite"  />
        </Stack>
    );
}

export default ProfileStack;