import { Stack } from "expo-router";
import React from "react";

const CartStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="status" />
            <Stack.Screen name="rating" />
            <Stack.Screen name="delivery" />
            <Stack.Screen name="qr" />
        </Stack>
    );
}

export default CartStack;