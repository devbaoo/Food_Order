import { getRestaurantsFromCart } from '@/api/modules/restaurant';
import BackgroundLoading2 from '@/components/loading/background_2';
import { RestaurantCard } from '@/components/ui/restaurant/ordered/item';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Restaurant } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const RestaurantOrdersList = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const { info } = useAuth();
    const { t } = useTranslation();

    const onLoad = async () => {
        setLoading(true);
        const restaurants = await getRestaurantsFromCart(info?.id as string);
        setTimeout(() => {
            setRestaurants(restaurants);
            setLoading(false);
        }, 600);
    }

    useEffect(() => {
        if (info) onLoad();
    }, [info]);

    const cuisineTypes = ['all', 'Vietnamese', 'Italian', 'Japanese', 'American', 'Thai'];

    const filteredRestaurants = restaurants;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{t("app.ordered_restaurant")}</Text>
                <Text style={styles.subtitle}>
                    {restaurants.length} {t("app.restaurant")} • {restaurants.reduce((sum, r) => sum, 0)} {t("app.order")}
                </Text>
            </View>

            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}
                    contentContainerStyle={styles.filterContent}
                >
                    {cuisineTypes.map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            style={[
                                styles.filterButton,
                                selectedFilter === cuisine && styles.filterButtonActive
                            ]}
                            onPress={() => setSelectedFilter(cuisine)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedFilter === cuisine && styles.filterTextActive
                            ]}>
                                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </ScrollView>

            {
                loading && <BackgroundLoading2 />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
    },
    filterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    filterContent: {
        paddingHorizontal: 20,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    filterButtonActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    filterText: {
        color: '#6c757d',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
});

export default RestaurantOrdersList;