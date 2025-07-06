import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

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
                    title: 'Trang chủ',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="home"
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="order"
                options={{
                    title: 'Đơn hàng',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="receipt-outline" size={24} color={focused ? "violet" : "black"} />
                    ),
                }}
            />
            <Tabs.Screen
                name="product"
                options={{
                    title: 'Sản phẩm',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="cube" size={24} color={focused ? "violet" : "black"} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Hồ sơ',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="person" size={24} color={focused ? "violet" : "black"} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default AppStack;