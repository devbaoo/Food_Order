import assets from "@/assets";
import Icon from "@/components/icon";
import BackgroundLoading from "@/components/loading/background";
import { firestore } from "@/lib/firebase-config";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { CartItem, Category, Food } from "@/types";
import { calculateCart } from "@/utils/calculate";
import screen from "@/utils/screen";
import { doc, setDoc } from "@firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Animated
} from "react-native";

export default function ResultScreen() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const params = useLocalSearchParams();
    const scrollY = new Animated.Value(0);
    const [shouldSyncCart, setShouldSyncCart] = useState<boolean>(false);
    const { cart, setCart } = useAuth();

    useEffect(() => {
        if (!params || !params.data) router.back();
        onLoad();
    }, []);

    const onLoad = async () => {
        try {
            setLoading(true);
            const result = await JSON.parse(params.data as string);
            setFoods(result);
        }
        finally {
            setLoading(false);
        }
    }

    const addToCart = (item: Food) => {
        if (!cart) return;

        setCart(prevCart => prevCart ? calculateCart(prevCart, item, 'add') : null);
        setShouldSyncCart(true);
    };

    const removeFromCart = (item: Food) => {
        if (!cart) return;

        if (cart.cartItems.filter(x => x.foodId === item.id).length >= 1) {
            setCart(prevCart => prevCart ? calculateCart(prevCart, item, 'remove') : null);
            setShouldSyncCart(true);
        }
    }

    useEffect(() => {
        if (shouldSyncCart) {
            updateCart();
            setShouldSyncCart(false); // reset
        }
    }, [shouldSyncCart]);

    const updateCart = async () => {
        setUpdateLoading(true);
        try {
            if (cart) {
                await setDoc(doc(firestore, 'carts', cart.id), { ...cart });
            }
        } catch (err) {
            console.error("Error adding cart items:", err);
        } finally {
            setUpdateLoading(false);
        }
    }

    const renderFoodItem = ({ item, index }: { item: Food, index: number }) => {
        return (
            <Animated.View
                style={{
                    ...styles.foodItemContainer,
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [-100, 0, 100 * index, 100 * (index + 2)],
                            outputRange: [0, 0, 0, 50],
                            extrapolate: 'clamp'
                        })
                    }]
                }}
            >
                <TouchableOpacity
                    style={styles.foodItem}
                    activeOpacity={0.9}
                    onPress={() => { }}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={styles.foodImage}
                        resizeMode="cover"
                    />
                    <View style={styles.foodInfoContainer}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <View style={styles.ratingContainer}>
                            <TouchableOpacity
                                onPress={() => removeFromCart(item)}
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    padding: 8,
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10
                                }}
                                disabled={updateLoading}
                            >
                                <Icon icon={assets.icon.trash} size={16} />
                            </TouchableOpacity>
                            <Text>{cart?.cartItems.find((x: CartItem) => x.foodId === item.id)?.quantity ?? 0}</Text>
                            <TouchableOpacity
                                onPress={() => addToCart(item)}
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    padding: 8,
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10
                                }}
                                disabled={updateLoading}
                            >
                                <Icon icon={assets.icon.plus} size={16} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.foodPrice}>
                            ${item.price?.toFixed(2) || "10.99"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />

            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientBackground}
            >
                {/* Animated Header */}
                <Animated.View style={[styles.header]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace("/(home)")}
                    >
                        <Icon icon={assets.icon.home_active || "chevron-left"} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Food Results</Text>
                    <View style={{ width: 24 }} />
                </Animated.View>

                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Found {foods.length} Results</Text>
                    <Text style={styles.subtitle}>Explore your delicious options</Text>
                </View>

                {/* Results Section */}
                <View style={styles.resultsContainer}>
                    <Animated.FlatList
                        data={foods}
                        keyExtractor={(item) => item.id}
                        renderItem={renderFoodItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContentContainer}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                    />
                </View>
            </LinearGradient>

            {loading && <BackgroundLoading />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    gradientBackground: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 60,
        position: 'absolute',
        top: StatusBar.currentHeight || 40,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    resultsContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    listContentContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    foodItemContainer: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    foodItem: {
        flexDirection: 'row',
        borderRadius: 16,
        overflow: 'hidden',
        height: screen.height / 8,
    },
    foodImage: {
        width: screen.width * 0.3,
        height: '100%',
    },
    foodInfoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    foodPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00696C',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        width: '90%',
        maxHeight: '80%',
    },
    modalImage: {
        width: '100%',
        height: screen.height / 4,
    },
    modalInfoContainer: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    modalRatingText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#666',
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginTop: 12,
        marginBottom: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00696C',
    },
    addButton: {
        backgroundColor: '#00696C',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});