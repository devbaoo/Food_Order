import { Restaurant } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TFunction } from "i18next";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, ImageBackground } from "react-native";

export const renderRestaurantCard = (
    restaurant: Restaurant,
    isLarge = false,
    showFavourite = true,
    handleUpdateFavourite: (restaurantId: string) => void,
    t: TFunction<"translation", undefined>
) => {
    return (
        <TouchableOpacity
            key={restaurant?.id}
            style={[styles.restaurantCard, isLarge && styles.largeRestaurantCard]}
            onPress={() => router.push({ pathname: '/(restaurant)', params: { id: restaurant.id } })}
        >
            <View style={[styles.restaurantImage, isLarge && styles.largeRestaurantImage]}>
                <ImageBackground source={{ uri: restaurant.imageUrl }} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <View style={styles.deliveryTime}>
                        <Text style={styles.deliveryTimeText}>20 - 30 {t("app.minutes")}</Text>
                        <Text numberOfLines={1} style={styles.deliveryTimeText}>{t("app.address")}: {restaurant.address}</Text>
                    </View>
                    {
                        showFavourite && <TouchableOpacity style={styles.favoriteButton}
                            onPress={() => handleUpdateFavourite(restaurant.id)}
                        >
                            <Ionicons name={restaurant.favourite ? "heart" : "heart-outline"} size={20} color={restaurant.favourite ? "red" : "#666"} />
                        </TouchableOpacity>
                    }
                </ImageBackground>
            </View>

            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant?.name ?? "Loading..."}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <Text style={styles.rating}>{(restaurant?.rating ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })}</Text>
                    <Text style={styles.reviews}>({restaurant?.ratingCount})</Text>
                </View>

                {["Miễn phí giao hàng", "Giảm giá 20%"].length > 0 && (
                    <View style={styles.tagsContainer}>
                        {["Miễn phí giao hàng", "Giảm giá 20%"].map((tag: any, index: number) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
};

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
        overflow: 'hidden'
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
        overflowX: 'hidden',
        maxWidth: '60%'
    },
    deliveryTimeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
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

    restaurantInfo: {
        padding: 12,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rating: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    reviews: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666',
    },

    cuisine: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#FFE5E5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 10,
        color: '#FF4444',
        fontWeight: '500',
    },
})