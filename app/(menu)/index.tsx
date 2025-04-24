import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native"
import { useSharedValue, withTiming } from "react-native-reanimated";
import MenuHeader from "@/components/ui/menu/menu/header";
import MenuItem from "@/components/ui/menu/menu/item";
import MenuAddToCartButton from "@/components/ui/menu/menu/button";
import { router, useLocalSearchParams } from "expo-router";
import { Food, Restaurant } from "@/types";
import { getAllFoods } from "@/api/modules/food";
import BackgroundLoading from "@/components/loading/background";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { toast } from "@/utils/toast";
import { calculateCart } from "@/utils/calculate";

export default function MenuScreen() {
    const { cart, setCart } = useAuth();
    const [foods, setFoods] = useState<Food[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [toggled, setToggled] = useState(false);
    const progress = useSharedValue(0);
    const { restaurant } = useLocalSearchParams();

    useEffect(() => {
        if (!cart) {
            toast.error("Alrert", "An error occured with your cart, please check again!");
            router.replace('/(auth)/login');
            return
        }
    }, [cart]);

    const addToCart = (item: Food) => {
        if (!cart) return;

        setCart(prevCart => prevCart ? calculateCart(prevCart, item, 'add') : null);

        handleToggle();
    };

    const removeFromCart = (item: Food) => {
        if (!cart) return;

        setCart(prevCart => prevCart ? calculateCart(prevCart, item, 'remove') : null);
    }

    const handleToggle = () => {
        setToggled(true);
        progress.value = withTiming(1, { duration: 600 });
    };

    const handleUnToggle = () => {
        setToggled(false);
        progress.value = withTiming(0, { duration: 600 });
    };

    const onLoad = async (restaurantId: string) => {
        try {
            setLoading(false);
            const foods = await getAllFoods(restaurantId);
            setFoods(foods);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!restaurant) {
            router.back();
            return;
        }

        const res: Restaurant = typeof restaurant === 'string' ? JSON.parse(restaurant) : null;
        if (!res) {
            router.back();
            return;
        }

        setSelectedRestaurant(res);
        onLoad(res.id);

    }, [restaurant]);

    useEffect(() => {
        if (cart && cart.cartItems.length <= 0) handleUnToggle();
    }, [cart]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <MenuHeader restaurant={selectedRestaurant} progress={progress} cart={cart} />

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
                    {foods.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            onRemove={() => removeFromCart(item)}
                            onAdd={() => addToCart(item)}
                            cart={cart}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Add to Cart Button */}
            <MenuAddToCartButton cart={cart} />

            {loading && <BackgroundLoading />}
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