import { Ionicons } from '@expo/vector-icons';
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

// Mock restaurant data
const mockRestaurants = [
    {
        id: 1,
        name: 'The Golden Spoon',
        cuisine: 'Italian',
        rating: 4.8,
        distance: '0.3 km',
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop',
        priceRange: '$$',
        isOpen: true
    },
    {
        id: 2,
        name: 'Sakura Sushi',
        cuisine: 'Japanese',
        rating: 4.6,
        distance: '0.8 km',
        deliveryTime: '30-40 min',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=250&fit=crop',
        priceRange: '$$$',
        isOpen: true
    },
    {
        id: 3,
        name: 'Burger Palace',
        cuisine: 'American',
        rating: 4.4,
        distance: '1.2 km',
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop',
        priceRange: '$',
        isOpen: false
    },
    {
        id: 4,
        name: 'Spice Garden',
        cuisine: 'Indian',
        rating: 4.7,
        distance: '0.5 km',
        deliveryTime: '35-45 min',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=250&fit=crop',
        priceRange: '$$',
        isOpen: true
    },
    {
        id: 5,
        name: 'Taco Fiesta',
        cuisine: 'Mexican',
        rating: 4.3,
        distance: '0.7 km',
        deliveryTime: '15-25 min',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
        priceRange: '$',
        isOpen: true
    },
    {
        id: 6,
        name: 'Le Petit Bistro',
        cuisine: 'French',
        rating: 4.9,
        distance: '1.5 km',
        deliveryTime: '40-50 min',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
        priceRange: '$$$$',
        isOpen: true
    }
];

export default function RestaurantSearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
    const { t } = useTranslation();

    useEffect(() => {
        let filtered = mockRestaurants;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by cuisine
        if (selectedCuisine !== 'All') {
            filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
        }

        setFilteredRestaurants(filtered);
    }, [searchQuery, selectedCuisine]);

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

    const RestaurantCard = ({ restaurant }: any) => (
        <TouchableOpacity style={styles.restaurantCard}>
            <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {renderStars(restaurant.rating)}
                        </View>
                        <Text style={styles.rating}>{restaurant.rating}</Text>
                    </View>
                </View>

                <Text style={styles.cuisine}>{restaurant.cuisine} • {restaurant.priceRange}</Text>

                <View style={styles.restaurantDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="map" size={14} color="#666" />
                        <Text style={styles.detailText}>{restaurant.distance}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons name="calendar" size={14} color="#666" />
                        <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: restaurant.isOpen ? '#E8F5E8' : '#FFF0F0' }]}>
                        <Text style={[styles.statusText, { color: restaurant.isOpen ? '#22C55E' : '#EF4444' }]}>
                            {restaurant.isOpen ? 'Open' : 'Closed'}
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
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('app.search')}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredRestaurants.length} {t("app.restaurant")}{filteredRestaurants.length !== 1 ? 's' : ''} {t("app.found")}
                </Text>
            </View>

            {/* Restaurant List */}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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