import assets from "@/assets";
import Icon from "@/components/icon";
import screen from "@/utils/screen";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native"
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { router } from "expo-router";
import MenuHeader from "@/components/ui/menu/menu/header";
import MenuItem from "@/components/ui/menu/menu/item";
import MenuAddToCartButton from "@/components/ui/menu/menu/button";

export default function MenuScreen() {
    const [cart, setCart] = useState<any[]>([]);
    const [toggled, setToggled] = useState(false);
    const progress = useSharedValue(0);

    const menuItems = [
        { id: 1, name: 'Pho Tai', price: '3.45' },
        { id: 2, name: 'Pho Nam', price: '3.45' },
        { id: 3, name: 'Pho Bap Bo', price: '3.45' },
        { id: 4, name: 'Pho Ga', price: '3.45' },
        { id: 5, name: 'Pho Ga Dui', price: '3.45' },
        { id: 6, name: 'Pho Ga Dui', price: '3.45' },
        { id: 7, name: 'Pho Ga Dui', price: '3.45' },
        { id: 8, name: 'Pho Ga Dui', price: '3.45' },
        { id: 9, name: 'Pho Ga Dui', price: '3.45' },
    ];

    const addToCart = (item: any) => {
        const existingItem = cart.find(x => x.id === item.id);

        if (existingItem) {
            setCart(cart.map(x =>
                x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }

        handleToggle();
    };

    const removeFromCart = (item: any) => {
        const existingItem = cart.find(x => x.id === item.id);

        if (existingItem) {
            if (existingItem.quantity === 1) {
                setCart(cart.filter(x => x.id !== item.id));
            }
            else {
                setCart(cart.map(x =>
                    x.id === item.id ? { ...x, quantity: x.quantity - 1 } : x
                ));
            }
        }
    }

    const handleToggle = () => {
        setToggled(true);
        progress.value = withTiming(1, { duration: 600 });
    };

    const handleUnToggle = () => {
        setToggled(false);
        progress.value = withTiming(0, { duration: 600 });
    };

    useEffect(() => {
        if (cart.length <= 0) handleUnToggle();
    }, [cart]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <MenuHeader progress={progress} />

            <View style={{ width: '100%', height: 1, backgroundColor: toggled ? 'rgba(0, 0, 0, 0.1)' : 'white', marginBottom: 15 }} />

            {/* Menu Items */}
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.menuList}
                    contentContainerStyle={{
                        paddingBlock: 10,
                        paddingHorizontal: 15,
                        gap: 10
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            onRemove={() => removeFromCart(item)}
                            onAdd={() => addToCart(item)}
                            selectedItems={cart}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Add to Cart Button */}
            <MenuAddToCartButton selectedItems={cart} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 32,
    },

    
    menuList: {
        flex: 1,
    },
})