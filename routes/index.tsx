import useOrderNotification from "@/hooks/useOrderNotification";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { Stack } from "expo-router";
import React from "react";

const AppNavigator: React.FC = () => {
    const { restaurant } = useAuth();

    useOrderNotification(restaurant?.id);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(cart)" options={{ headerShown: false }} />
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            <Stack.Screen name="(menu-ai)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(notification)" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="(restaurant)" options={{ headerShown: false }} />
            <Stack.Screen name="(seller-home)" options={{ headerShown: false }} />
            <Stack.Screen name="(seller)" options={{ headerShown: false }} />
            <Stack.Screen name="(shipper-home)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AppNavigator;
