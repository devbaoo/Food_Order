import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getRestaurantById } from '@/api/modules/restaurant';
import { Food, Restaurant } from '@/types';
import MenuSelection from '@/components/ui/restaurant/home/selection';
import FoodOrderPageModal from '@/components/ui/restaurant/home/modal';
import { useTranslation } from 'react-i18next';
import screen from '@/utils/screen';
import { useAuth } from '@/providers/AuthenticatedProvider';
import * as Clipboard from 'expo-clipboard';
import { toast } from '@/utils/toast';

export default function RestaurantPage() {
    const [activeTab, setActiveTab] = useState({
        id: 'com',
        name: 'Cơm'
    });
    const params = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [visible, setVisible] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const { info } = useAuth();
    const { t } = useTranslation();

    const onLoad = async () => {
        const restaurant = await getRestaurantById(params.id as string, info?.id);

        if (restaurant) {
            setRestaurant(restaurant);
            if (restaurant.categories && restaurant.categories?.length > 0) {
                setActiveTab(restaurant.categories[0]);
            }
        };
    }

    const copyRestaurantToClipboard = () => {
        if (restaurant) {
            const content = `
            🏠 ${restaurant.name}
            ⭐ ${restaurant.rating} (${restaurant.ratingCount} ${restaurant.ratingCount === 1 ? 'đánh giá' : 'đánh giá'})
            📍 ${restaurant.address}
            🆔 ID: ${restaurant.id}
        `;

            Clipboard.setStringAsync(content);
            toast.info(t('app.copied_to_clipboard'), t('app.restaurant_info_copied'));
        }
        else {
            toast.error(t('app.error'), t('app.restaurant_not_found'));
        }
    };

    useEffect(() => {
        if (params && params.id) {
            onLoad();
        }
    }, [params?.id]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIcon} onPress={() => {
                        if (!restaurant) {
                            toast.error(t('app.error'), t('app.restaurant_not_found'));
                            return;
                        }
                        router.push({
                            pathname: '/(restaurant)/info',
                            params: { restaurantSF: JSON.stringify(restaurant) }
                        })
                    }}>
                        <Ionicons name="information-circle-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon} onPress={copyRestaurantToClipboard}>
                        <Ionicons name="share-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: screen.width * 0.05 }} showsVerticalScrollIndicator={false}>
                {/* Restaurant Info */}
                <View style={styles.restaurantInfo}>
                    <Image source={{ uri: restaurant?.imageUrl }} style={styles.restaurantImage} />
                    <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>{(restaurant?.rating ?? 0).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        })}</Text>
                        <Text style={styles.ratingsCount}>({restaurant?.ratingCount} {t("app.rating")})</Text>
                    </View>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons key={star} name="star" size={16} color="#FFD700" />
                        ))}
                    </View>
                </View>

                {/* Delivery Info */}
                <View style={{
                    borderWidth: 1,
                    borderColor: '#A4A4A4',
                    padding: 5,
                    marginHorizontal: 16,
                    borderRadius: 10,
                    marginBlock: 15
                }}>
                    <View style={styles.deliveryInfo}>
                        <View style={styles.deliveryItem}>
                            <Ionicons name="bicycle" size={16} color="#666" />
                            <Text style={styles.deliveryText}>{t("app.delivery_in_30_to_40_minutes")}</Text>
                        </View>
                        <View style={styles.deliveryItem}>
                            <Text style={styles.deliveryLabel}>{t("app.change")}</Text>
                        </View>
                    </View>

                    <View style={styles.freeShippingInfo}>
                        <Text style={styles.freeShippingText}>
                            {t("app.freeship_in")}
                        </Text>
                    </View>
                </View>

                {/* Discount Badges */}
                <View style={styles.discountContainer}>
                    <View style={[styles.discountBadge, styles.discountBadge20]}>
                        <Text style={styles.discountText}>{t("app.20_%_off")}</Text>
                        <Text style={styles.discountSubtext}>{t("app.min_order_100")}</Text>
                    </View>
                    <View style={[styles.discountBadge, styles.discountBadge30]}>
                        <Text style={styles.discountText}>{t("app.30_%_off")}</Text>
                        <Text style={styles.discountSubtext}>{t("app.min_order_120")}</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t("app.search")}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Menu Tabs */}
                <ScrollView style={styles.menuTabs} horizontal showsHorizontalScrollIndicator={false}>
                    {(restaurant?.categories ?? []).map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.menuTab,
                                activeTab.id === tab.id && styles.activeMenuTab
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.menuTabText,
                                activeTab.id === tab.id && styles.activeMenuTabText
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Menu Section */}
                <MenuSelection
                    selectedCategory={activeTab}
                    restaurantId={params.id as string}
                    onItemClicked={(food: Food) => {
                        setVisible(true);
                        setSelectedFood(food);
                    }}
                    t={t}
                />
            </ScrollView>

            <FoodOrderPageModal
                visible={visible}
                onClose={() => {
                    setVisible(false);
                    setSelectedFood(null);
                }}
                selectedFood={selectedFood}
                t={t}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    backButton: {
        padding: 4,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    headerIcon: {
        marginLeft: 16,
        padding: 4,
    },
    content: {
        flex: 1,
    },
    restaurantInfo: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10
    },
    restaurantImage: {
        width: 80,
        height: 80,
        backgroundColor: '#9CA3AF',
        borderRadius: 20,
        marginBottom: 12,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginRight: 4,
    },
    ratingsCount: {
        fontSize: 12,
        color: '#666',
    },
    deliveryInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    deliveryItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    deliveryLabel: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    freeShippingInfo: {
        paddingHorizontal: 16,
    },
    freeShippingText: {
        fontSize: 14,
        color: '#FF6B35',
        lineHeight: 18,
    },
    discountContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 12,
    },
    discountBadge: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
    },
    discountBadge20: {
        backgroundColor: '#E0F7F7',
    },
    discountBadge30: {
        backgroundColor: '#F5F5F5',
    },
    discountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    discountSubtext: {
        fontSize: 12,
        color: '#666',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 16,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#000',
        height: 40
    },
    menuTabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    menuTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 20,
    },
    activeMenuTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF6B35',
    },
    menuTabText: {
        fontSize: 16,
        color: '#666',
    },
    activeMenuTabText: {
        color: '#000',
        fontWeight: '500',
    },
});