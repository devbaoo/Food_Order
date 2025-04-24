import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import CartHeader from '@/components/ui/cart/cart/header';
import CartItem from '@/components/ui/cart/cart/item';
import CartNote from '@/components/ui/cart/cart/note';
import CartDeliveryProgress from '@/components/ui/cart/cart/progress';
import CartRecommendItem from '@/components/ui/cart/cart/recommend';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { toast } from '@/utils/toast';
import { Food } from '@/types';
import { doc, setDoc } from '@firebase/firestore';
import { firestore } from '@/lib/firebase-config';

export default function CartScreen() {
    const { cart, setCart } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [shouldSyncCart, setShouldSyncCart] = useState<boolean>(false);
    const FREE_DELIVERY_THRESHOLD = 10;

    useEffect(() => {
        if (!cart) {
            toast.error("Alrert", "An error occured with your cart, please check again!");
            router.replace('/(auth)/login');
            return
        }
    }, [cart]);

    useEffect(() => {
        if (shouldSyncCart) {
            updateCart();
            setShouldSyncCart(false); // reset
        }
    }, [shouldSyncCart]);

    const addToCart = async (item: Food) => {
        if (!cart) return;

        const existingItem = cart.cartItems.find(x => x.foodId === item.id);

        if (existingItem) {
            setCart(prevCart => {
                if (!prevCart) return null;

                const updatedItems = prevCart.cartItems.map(x =>
                    x.foodId === item.id ? { ...x, quantity: x.quantity + 1, price: item.price } : x
                );

                const totalPrice = updatedItems.reduce(
                    (total, current) => total + current.quantity * current.price,
                    0
                );

                return {
                    ...prevCart,
                    cartItems: updatedItems,
                    totalPrice,
                };
            });
        } else {
            setCart(prevCart => {
                if (!prevCart) return null;

                const updatedItems = [...prevCart.cartItems, { foodId: item.id, quantity: 1, price: item.price }];

                const totalPrice = updatedItems.reduce(
                    (total, current) => total + current.quantity * current.price,
                    0
                );

                return {
                    ...prevCart,
                    cartItems: updatedItems,
                    totalPrice,
                };
            });
        }

        setShouldSyncCart(true);
    };

    const removeFromCart = async (item: Food) => {
        if (!cart) return;

        const existingItem = cart.cartItems.find(x => x.foodId === item.id);

        if (existingItem) {
            if (existingItem.quantity === 1) {
                setCart(prevCart => {
                    if (!prevCart) return null;

                    const updatedItems = cart.cartItems.filter(x => x.foodId !== item.id);

                    const totalPrice = updatedItems.reduce(
                        (total, current) => total + current.quantity * current.price,
                        0
                    );

                    return {
                        ...prevCart,
                        cartItems: updatedItems,
                        totalPrice,
                    };
                });
            }
            else {
                setCart(prevCart => {
                    if (!prevCart) return null;

                    const updatedItems = prevCart.cartItems.map(x =>
                        x.foodId === item.id ? { ...x, quantity: x.quantity - 1, price: item.price } : x
                    );

                    const totalPrice = updatedItems.reduce(
                        (total, current) => total + current.quantity * current.price,
                        0
                    );

                    return {
                        ...prevCart,
                        cartItems: updatedItems,
                        totalPrice,
                    };
                });
            }
        }

        setShouldSyncCart(true);
    }

    const updateCart = async () => {
        setLoading(true);
        try {
            if (cart) {
                await setDoc(doc(firestore, 'carts', cart.id), { ...cart });
            }
        } catch (err) {
            console.error("Error adding cart items:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, }}
            >
                {/* Header */}
                <CartHeader />

                {/* Cart Item */}
                <View style={{ gap: 10 }}>
                    {cart && cart.cartItems.length > 0 && cart.cartItems.map((item, index) => (
                        <CartItem
                            item={item}
                            key={index.toString()}
                            onAdd={addToCart}
                            onRemove={removeFromCart}
                            loading={loading}
                        />
                    ))}
                </View>

                {
                    cart && cart.cartItems.length > 0 && (
                        <>
                            {/* Delivery Progress */}
                            <CartDeliveryProgress value={FREE_DELIVERY_THRESHOLD} cart={cart} />

                            {/* Recommended Items */}
                            <CartRecommendItem value={FREE_DELIVERY_THRESHOLD} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />

                            <CartNote value={FREE_DELIVERY_THRESHOLD} cart={cart} />
                        </>
                    )
                }
            </ScrollView>

            {/* Checkout Button */}
            <View style={{
                paddingTop: 15,
                paddingBottom: 30,
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 9,
                },
                shadowOpacity: 0.50,
                shadowRadius: 12.35,
                backgroundColor: 'white',
                elevation: 19,
            }}>
                <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/(cart)/checkout')}>
                    <Text style={styles.checkoutButtonText}>Go to checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32
    },

    checkoutButton: {
        backgroundColor: '#00C0E2',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});