import { getRestaurantsBySearchTerm } from '@/api/modules/restaurant';
import { Restaurant } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import i18next from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';

export default function RestaurantSearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const { t } = useTranslation();

    const onLoad = async () => {
        try {
            setLoading(true);
            let restaurants = await getRestaurantsBySearchTerm(searchQuery);

            // Filter by search query
            if (searchQuery) {
                restaurants = restaurants.filter(restaurant =>
                    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setFilteredRestaurants(restaurants);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoad();
    }, [searchQuery]);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons name="star" key={i} size={12} fill="#FFD700" color="#FFD700" />);
        }

        if (hasHalfStar) {
            stars.push(<Ionicons name="star-half" key="half" size={12} fill="#FFD700" color="#FFD700" style={{ opacity: 0.5 }} />);
        }

        return stars;
    };

    const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
        <TouchableOpacity style={styles.restaurantCard} onPress={() => router.push({ pathname: '/(restaurant)', params: { id: restaurant.id } })}>
            <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {renderStars(restaurant.rating)}
                        </View>
                        <Text style={styles.rating}>{restaurant.rating.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        })}</Text>
                    </View>
                </View>

                <Text style={styles.cuisine}>{restaurant.address}</Text>

                <View style={styles.restaurantDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="map" size={14} color="#666" />
                        <Text style={styles.detailText}>0.3km</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons name="calendar" size={14} color="#666" />
                        <Text style={styles.detailText}>30 - 40p</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: '#E8F5E8' }]}>
                        <Text style={[styles.statusText, { color: '#22C55E' }]}>
                            Đang mở
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t("app.search")}</Text>
                {/* <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color="#333" />
                </TouchableOpacity> */}
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('app.search_restaurant')}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredRestaurants.length} {t("app.restaurant")}{i18next.language === "en" && filteredRestaurants.length !== 1 ? 's' : ''} {t("app.found")}
                </Text>
            </View>

            {/* Restaurant List */}
            {
                loading ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Đang tải...</Text>
                    </View>
                    :
                    <ScrollView
                        style={styles.restaurantsList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.restaurantsContent}
                    >
                        {filteredRestaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}

                        {filteredRestaurants.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>{t("app.no_restaurant_found")}</Text>
                                <Text style={styles.emptyStateSubtext}>{t("app.try_adjust")}</Text>
                            </View>
                        )}
                    </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 12
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingTop: 32
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    filterButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f4',
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        height: 40
    },
    filtersContainer: {
        backgroundColor: '#fff',
        paddingBottom: 16,
    },
    filtersContent: {
        paddingHorizontal: 20,
    },
    filterChip: {
        backgroundColor: '#f1f3f4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
    },
    filterChipActive: {
        backgroundColor: '#007AFF',
    },
    filterChipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    resultsCount: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    restaurantsList: {
        flex: 1,
    },
    restaurantsContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    restaurantCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    restaurantImage: {
        width: '100%',
        height: 160,
    },
    restaurantInfo: {
        padding: 16,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 4,
    },
    rating: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    cuisine: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    restaurantDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#666',
    },
});