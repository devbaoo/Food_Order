import assets from "@/assets";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

const AppStack: React.FC = () => {
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
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? assets.icon.home_active
                                    : assets.icon.home
                            }
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    title: 'Favourite',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? assets.icon.favourite_active
                                    : assets.icon.favourite
                            }
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? assets.icon.search_active
                                    : assets.icon.search
                            }
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? assets.icon.user_active
                                    : assets.icon.user
                            }
                            style={{ width: 23, height: 23 }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? assets.icon.menu_active
                                    : assets.icon.menu
                            }
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