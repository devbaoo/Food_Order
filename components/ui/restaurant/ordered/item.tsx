import { Restaurant } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";

export const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons name="star" key={i} size={16} fill="#FFD700" color="#FFD700" />);
        }
        if (hasHalfStar) {
            stars.push(<Ionicons name="star-half" key="half" size={16} fill="#FFD700" color="#FFD700" opacity={0.5} />);
        }
        return stars;
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push({ pathname: '/(restaurant)', params: { id: restaurant.id } })}>
            <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
                <View style={styles.cardheader}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <View>
                        <View style={styles.ratingContainer}>
                            <View style={styles.stars}>
                                {renderStars(restaurant.rating)}
                            </View>
                            <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Rating Count</Text>
                            <Text style={styles.statNumber}>{restaurant.ratingCount}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.favoriteItems}>
                    <Text style={styles.favoriteLabel}>Address: {restaurant.address}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardContent: {
        padding: 16,
    },
    cardheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1,
        marginRight: 10,
    },
    ratingContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6
    },
    stars: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    ratingText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    cuisine: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: '500',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#6c757d',
        marginLeft: 8,
        flex: 1,
    },
    orderStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    statItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    statLabel: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 2,
    },
    lastOrderText: {
        fontSize: 12,
        color: '#6c757d',
        marginLeft: 4,
    },
    favoriteItems: {
        marginTop: 5,
    },
    favoriteLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    favoriteText: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },
})