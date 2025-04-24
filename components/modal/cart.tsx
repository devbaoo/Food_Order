import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import Animated, { Easing, Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "../icon";
import assets from "@/assets";
import { Cart, Food } from "@/types";
import { getAllFoods } from "@/api/modules/food";
import screen from "@/utils/screen";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { calculateCart } from "@/utils/calculate";
import { doc, setDoc } from "@firebase/firestore";
import { firestore } from "@/lib/firebase-config";
import { router } from "expo-router";

interface CartModalProps {
    cart: Cart;
}

const CartModal: React.FC<CartModalProps> = ({ ...props }) => {
    const { cart } = props;
    const [expanded, setExpanded] = useState(false);
    const [shouldSyncCart, setShouldSyncCart] = useState<boolean>(false);
    const progress = useSharedValue(0);
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { setCart } = useAuth();

    const onLoad = async () => {
        try {
            const foods = await getAllFoods();
            setFoods(foods);
        }
        finally {

        }
    }

    useEffect(() => {
        onLoad();
    }, []);

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

    const handleToggle = () => {
        // Toggle the expanded state
        setExpanded(!expanded);

        // Animate the progress value
        progress.value = withTiming(expanded ? 0 : 1, {
            duration: 500,
            easing: Easing.bezierFn(0.16, 1, 0.3, 1), // Expo-out type easing
        });
    };

    // Animation for the container
    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(
                progress.value,
                [0, 1],
                [60, 120],
                Extrapolate.CLAMP
            ),
            backgroundColor: expanded ? '#FFFFFF' : '#22B8CF',
        };
    });

    // Animation for the basket icon
    const basketIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 0.3], [1, 0], Extrapolate.CLAMP),
            transform: [
                {
                    scale: interpolate(
                        progress.value,
                        [0, 0.5],
                        [1, 0.5],
                        Extrapolate.CLAMP
                    )
                },
                {
                    translateY: interpolate(
                        progress.value,
                        [0, 1],
                        [0, -30],
                        Extrapolate.CLAMP
                    )
                },
                {
                    translateX: interpolate(
                        progress.value,
                        [0, 1],
                        [0, -50],
                        Extrapolate.CLAMP
                    )
                },
            ],
        };
    });

    // Animation for the text
    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 0.3], [1, 0], Extrapolate.CLAMP),
        };
    });

    // Animation for the food item
    const foodItemAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0.3, 0.7], [0, 1], Extrapolate.CLAMP),
            transform: [
                {
                    translateY: interpolate(
                        progress.value,
                        [0.3, 0.7],
                        [20, 0],
                        Extrapolate.CLAMP
                    )
                }
            ],
        };
    });

    // Animation for the cart button
    const cartButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0.5, 0.8], [0, 1], Extrapolate.CLAMP),
            transform: [
                {
                    translateY: interpolate(
                        progress.value,
                        [0.5, 0.8],
                        [20, 0],
                        Extrapolate.CLAMP
                    )
                }
            ],
        };
    });

    useEffect(() => {
        if (shouldSyncCart) {
            updateCart();
            setShouldSyncCart(false); // reset
        }
    }, [shouldSyncCart]);

    return (
        <View style={styles.container}>
            {/* Animated bottom container */}
            <Animated.View style={[styles.bottomContainer, containerAnimatedStyle]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.touchArea}
                    onPress={!expanded ? handleToggle : undefined}
                >
                    {/* View Basket (First Screen) */}
                    <View style={styles.basketContainer}>
                        <Animated.View style={[styles.basketIconContainer, basketIconAnimatedStyle]}>
                            <View style={styles.iconBadgeContainer}>
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                    {cart.cartItems.map((item, index) => (
                                        <View
                                            style={{ padding: 8, backgroundColor: "white", borderRadius: screen.width }}
                                            key={index.toString()}
                                        >
                                            <Image
                                                source={{ uri: foods.find(x => x.id === item.foodId)?.image ?? 'https://via.placeholder.com/30' }}
                                                style={styles.basketIcon}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={{ width: 2, height: 31, backgroundColor: "white" }} />
                            <Animated.Text style={[styles.basketText, textAnimatedStyle]}>
                                View Basket
                            </Animated.Text>
                            <View>
                                <Icon icon={assets.icon.cart_white} size={24} />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>1</Text>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Expanded View (Second Screen) */}
            {expanded && (
                <TouchableOpacity
                    onPress={handleToggle}
                    activeOpacity={1}
                    style={[StyleSheet.absoluteFill, { backgroundColor: '#00C0E2' }]}
                >
                    <Animated.View
                        style={[styles.foodItemContainer, foodItemAnimatedStyle]}
                    >

                        <View>
                            {cart.cartItems.map((item, index) => (
                                <View style={styles.foodItemRow} key={index.toString()}>
                                    <Image
                                        source={{ uri: foods.find(x => x.id === item.foodId)?.image ?? 'https://via.placeholder.com/40' }}
                                        style={styles.foodImage}
                                    />
                                    <View style={styles.foodInfo}>
                                        <Text style={styles.foodName}>{foods.find(x => x.id === item.foodId)?.name ?? 'Pho Hanoi'}</Text>
                                        <Text style={styles.foodPrice}>${foods.find(x => x.id === item.foodId)?.price ?? '2.45'}</Text>
                                    </View>
                                    <View style={styles.quantityControl}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => {
                                                const food = foods.find(x => x.id === item.foodId);
                                                if (food) {
                                                    setCart(prevCart => prevCart ? calculateCart(prevCart, food, 'remove') : null);
                                                    setShouldSyncCart(true);
                                                }
                                            }}
                                            disabled={loading}
                                        >
                                            <Icon icon={assets.icon.trash} size={14} />
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => {
                                                const food = foods.find(x => x.id === item.foodId);
                                                if (food) {
                                                    setCart(prevCart => prevCart ? calculateCart(prevCart, food, 'add') : null);
                                                    setShouldSyncCart(true);
                                                }
                                            }}
                                            disabled={loading}
                                        >
                                            <Icon icon={assets.icon.plus} size={14} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Go to Cart Button */}
                        <TouchableOpacity onPress={() => router.push("/(cart)")}>
                            <Animated.View style={[styles.goToCartButton, cartButtonAnimatedStyle]}>
                                <Text style={styles.goToCartText}>Go to Cart</Text>
                                <View style={styles.cartIconContainer}>
                                    <Icon icon={assets.icon.cart_white} size={16} />
                                    <View style={styles.smallBadge}>
                                        <Text style={styles.smallBadgeText}>1</Text>
                                    </View>
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default CartModal;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        width: '100%'
    },
    bottomContainer: {
        backgroundColor: 'rgba(0, 192, 226, 80)',
        overflow: 'hidden',
        borderRadius: 7,
        marginHorizontal: 15,
        zIndex: 0
    },
    touchArea: {
        flex: 1,
        padding: 10,
    },
    basketContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 10,
    },
    basketIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10
    },
    iconBadgeContainer: {
        position: 'relative',
    },
    basketIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4848',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    basketText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    foodItemContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#00C0E2',
        zIndex: 10
    },
    foodItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    foodImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    foodInfo: {
        flex: 1,
        marginLeft: 12,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '500',
    },
    foodPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 4,
    },
    quantity: {
        marginHorizontal: 8,
        fontSize: 16,
    },
    quantityButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    goToCartButton: {
        backgroundColor: '#00696C',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goToCartText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    cartIconContainer: {
        position: 'relative',
    },
    cartIcon: {
        width: 20,
        height: 20,
        tintColor: 'white',
    },
    smallBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FF4848',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
})