import assets from "@/assets";
import Icon from "@/components/icon";
import { useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import Animated, { Easing, Extrapolate, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

export default function ProfileScreen() {
    const [expanded, setExpanded] = useState(false);
    const progress = useSharedValue(0);

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

    return (
        <View style={styles.container}>
            {/* Main view content would go here */}
            <View style={styles.content}>
                <Text style={styles.heading}>Food Delivery</Text>
                {/* Other food items would be listed here */}
            </View>

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
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/30' }}
                                    style={styles.basketIcon}
                                />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>1</Text>
                                </View>
                            </View>
                            <Animated.Text style={[styles.basketText, textAnimatedStyle]}>
                                View Basket
                            </Animated.Text>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Expanded View (Second Screen) */}
            {expanded && (
                <TouchableOpacity onPress={handleToggle} activeOpacity={1} style={StyleSheet.absoluteFill}>
                    <Animated.View
                        style={[styles.foodItemContainer, foodItemAnimatedStyle]}
                    >

                        <View style={styles.foodItemRow}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/40' }}
                                style={styles.foodImage}
                            />
                            <View style={styles.foodInfo}>
                                <Text style={styles.foodName}>Pho Hanoi</Text>
                                <Text style={styles.foodPrice}>$2.45</Text>
                            </View>
                            <View style={styles.quantityControl}>
                                <TouchableOpacity style={styles.quantityButton}>
                                    <Icon icon={assets.icon.trash} size={14} />
                                </TouchableOpacity>
                                <Text style={styles.quantity}>1</Text>
                                <TouchableOpacity style={styles.quantityButton}>
                                    <Icon icon={assets.icon.plus} size={14} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Go to Cart Button */}
                        <TouchableOpacity>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        backgroundColor: '#22B8CF',
        overflow: 'hidden',
        borderRadius: 7,
        marginHorizontal: 15,
    },
    touchArea: {
        flex: 1,
        padding: 10,
    },
    basketContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    basketIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBadgeContainer: {
        position: 'relative',
        marginRight: 8,
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
        backgroundColor: '#22B8CF',
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
});