import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import CartHeader from '@/components/ui/cart/cart/header';
import CartItem from '@/components/ui/cart/cart/item';
import CartNote from '@/components/ui/cart/cart/note';
import CartDeliveryProgress from '@/components/ui/cart/cart/progress';
import CartRecommendItem from '@/components/ui/cart/cart/recommend';
import { router } from 'expo-router';

export default function CartScreen() {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, }}
            >
                {/* Header */}
                <CartHeader />

                {/* Cart Item */}
                <CartItem
                    increaseQuantity={increaseQuantity}
                    quantity={quantity}
                />

                {/* Delivery Progress */}
                <CartDeliveryProgress />

                {/* Recommended Items */}
                <CartRecommendItem />

                <CartNote />
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