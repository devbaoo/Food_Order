import assets from "@/assets";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";

const AppStack: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Tabs screenOptions={{
            tabBarStyle: { height: 60, paddingHorizontal: 20, backgroundColor: 'white' },
            tabBarLabelStyle: { marginBlock: 'auto' },
            tabBarIconStyle: { marginBlock: 'auto' },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'black',
            headerShown: false
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: t('app.food'),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={assets.icon.chart}
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="menu-ai"
                options={{
                    title: t('app.menu_ai'),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={assets.icon.list}
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: t('app.search'),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={assets.icon.search}
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('app.account'),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={assets.icon.user}
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default AppStack;