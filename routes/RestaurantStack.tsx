import { Stack } from "expo-router";
import React from "react";

const RestaurantStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="currently-ordered" />
            <Stack.Screen name="review" />
            <Stack.Screen name="info" />
        </Stack>
    );
}

export default RestaurantStack;