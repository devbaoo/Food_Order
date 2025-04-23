import assets from "@/assets";
import Icon from "@/components/icon";
import { firestore } from "@/lib/firebase-config";
import { Cart } from "@/types";
import screen from "@/utils/screen";
import { doc, setDoc } from "@firebase/firestore";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from "react-native";

interface MenuAddToCartButtonProps {
    cart: Cart | null;
}

const MenuAddToCartButton: React.FC<MenuAddToCartButtonProps> = ({ ...props }) => {
    const { cart } = props;
    const [loading, setLoading] = useState<boolean>(false);

    const onAddToCart = async () => {
        setLoading(true);
        try {
            if (cart) {
                await setDoc(doc(firestore, 'carts', cart.id), { ...cart });
                router.replace('/(cart)');
            }
        } catch (err) {
            console.error("Error adding cart items:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart} disabled={loading}>
            {loading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
            <Text style={styles.addToCartButtonText}>Add to cart</Text>
            <View style={styles.cartIcon}>
                <Icon icon={assets.icon.cart_white} size={16} />
                {
                    cart && cart.cartItems.length > 0 && (
                        <View style={{ top: -8, right: -12, position: 'absolute' }}>
                            <View style={styles.quantityWrapper}>
                                <Text style={{ fontSize: 12.4, color: 'white' }}>{cart?.cartItems.length}</Text>
                            </View>
                        </View>
                    )
                }
            </View>
        </TouchableOpacity >
    )
}

export default MenuAddToCartButton;

const styles = StyleSheet.create({
    addToCartButton: {
        backgroundColor: '#008080',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 8,
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cartIcon: {
        marginLeft: 10,
        position: 'relative'
    },

    quantityWrapper: {
        backgroundColor: '#FF0019',
        borderRadius: screen.width,
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18
    }
})