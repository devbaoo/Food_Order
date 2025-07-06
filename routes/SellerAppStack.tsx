import { Stack } from "expo-router";
import React from "react";

const SellerAppStack: React.FC = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="register-restaurant" />
        </Stack>
    );
};

export default SellerAppStack;