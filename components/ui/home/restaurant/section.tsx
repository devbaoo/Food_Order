import { Restaurant } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react"
import { ImageBackground, StyleSheet, TouchableOpacity, View, Text } from "react-native"

export const RestaurantSection = ({ ...props }) => {
    const { restaurantsStar, t } = props;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Ionicons
                key={index}
                name="star"
                size={12}
                color={index < rating ? '#FFD700' : '#E0E0E0'}
            />
        ));
    };

    return (
        <View style={styles.restaurantsStarContainer}>
            {restaurantsStar.map((restaurant: Restaurant) => (
                <TouchableOpacity
                    key={restaurant.id}
                    style={styles.restaurantStarCard}
                    onPress={() => router.push({ pathname: '/(restaurant)', params: { id: restaurant.id } })}
                >
                    <View style={[styles.restaurantStarImage]}>
                        <ImageBackground source={{ uri: restaurant.imageUrl }} style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-15%</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.restaurantStarInfo}>
                        <Text style={styles.restaurantStarName}>{restaurant.name}</Text>
                        <Text style={styles.restaurantStarSubtitle}>{t("app.food")}</Text>
                        <View style={styles.ratingContainer}>
                            {renderStars(restaurant.rating)}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    restaurantCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    largeRestaurantCard: {
        marginBottom: 20,
    },
    restaurantImage: {
        height: 120,
        backgroundColor: '#E5E5E5',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        position: 'relative',
    },
    largeRestaurantImage: {
        height: 160,
    },
    deliveryTime: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    deliveryTimeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 20,
    },
    restaurantsStarContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    restaurantStarCard: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    restaurantStarImage: {
        height: 100,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        position: 'relative',
        overflow: 'hidden'
    },

    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#4ECDC4',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    discountText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    restaurantStarInfo: {
        padding: 12,
    },
    restaurantStarName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    restaurantStarSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
})