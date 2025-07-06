import { getFavouriteRestaurants } from '@/api/modules/restaurant';
import assets from '@/assets';
import BackgroundLoading2 from '@/components/loading/background_2';
import { RestaurantCard } from '@/components/ui/restaurant/ordered/item';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Restaurant } from '@/types';
import screen from '@/utils/screen';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';

const FavoritesScreen = () => {
    const [activeTab, setActiveTab] = useState('quan-an'); // 'quan-an' or 'cua-hang'
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const { info } = useAuth();
    const { t } = useTranslation();

    const onLoad = async () => {
        setLoading(true);
        const restaurants = await getFavouriteRestaurants(info?.id ?? "");
        setTimeout(() => {
            setRestaurants(restaurants);
            setLoading(false);
        }, 500);
    }

    useEffect(() => {
        if (info) onLoad();
    }, [info]);

    const handleBackPress = () => {
        router.back()
    };

    const handleNotificationPress = () => {
        console.log('Notification pressed');
    };

    const handleFindStoresPress = () => {
        router.push('/(home)/search');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{t("app.favourite")}</Text>

                <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                    <MaterialIcons name="notifications-none" size={24} color="#333" />
                    {/* <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>1</Text>
                    </View> */}
                </TouchableOpacity>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'quan-an' && styles.activeTab]}
                    onPress={() => setActiveTab('quan-an')}
                >
                    <Text style={[styles.tabText, activeTab === 'quan-an' && styles.activeTabText]}>
                        {t("app.restaurant")}
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={[styles.tab, activeTab === 'cua-hang' && styles.activeTab]}
                    onPress={() => setActiveTab('cua-hang')}
                >
                    <Text style={[styles.tabText, activeTab === 'cua-hang' && styles.activeTabText]}>
                        {t("app.store")}
                    </Text>
                </TouchableOpacity> */}
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButtonActive}>
                    <Text style={styles.filterButtonActiveText}>{t("app.delivery")}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>{t("app.take_food")}</Text>
                </TouchableOpacity>
            </View>

            {/* Empty State Content */}
            {
                loading ?
                    <BackgroundLoading2 />
                    :
                    restaurants.length === 0 ?
                        <View style={styles.emptyStateContainer}>
                            {/* Logo Placeholder */}
                            <View style={styles.logoContainer}>
                                <Image source={assets.logo} style={{ height: screen.height * 0.09, objectFit: 'contain' }} />
                            </View>

                            {/* Empty State Text */}
                            <Text style={styles.emptyTitle}>{t("app.your_favourite_is_empty")}</Text>
                            <Text style={styles.emptySubtitle}>
                                {t("app.favourite_hint")}
                            </Text>

                            {/* Call to Action Button */}
                            <TouchableOpacity style={styles.ctaButton} onPress={handleFindStoresPress}>
                                <Text style={styles.ctaButtonText}>{t("app.let_find_favourite_restaurant")}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {
                                restaurants.map((restaurant) => (
                                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                ))
                            }
                        </ScrollView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    notificationButton: {
        padding: 8,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF5722',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#FF5722',
    },
    tabText: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
        textTransform: "capitalize"
    },
    activeTabText: {
        color: '#FF5722',
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        gap: 12,
    },
    filterButtonActive: {
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterButtonActiveText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    filterButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF5722',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    logoText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoE: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    logoEText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    ctaButton: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    ctaButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FavoritesScreen;