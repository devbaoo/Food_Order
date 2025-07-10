import useOrderNotification from "@/hooks/useOrderNotification";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const AppNavigator: React.FC = () => {
    const { restaurant, setToken } = useAuth();

    useOrderNotification(restaurant?.id);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) setToken(token);
        });

        // Lắng nghe notification đến khi app đang mở
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            subscription.remove();
            responseListener.remove();
        };
    }, []);

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
