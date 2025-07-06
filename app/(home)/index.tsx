import { updateFavourite } from "@/api/modules/favourite";
import { getAllRestaurants } from "@/api/modules/restaurant";
import assets from "@/assets";
import BannerCarousel from "@/components/banner/carousel";
import { CountdownTimer } from "@/components/text/countdown";
import { renderRestaurantCard } from "@/components/ui/home/restaurant/card";
import { RestaurantSection } from "@/components/ui/home/restaurant/section";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { Restaurant } from "@/types";
import { shuffleArray } from "@/utils/array";
import { haversineDistance } from "@/utils/calculate";
import screen from "@/utils/screen";
import { toast } from "@/utils/toast";
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, TextInput, ImageBackground, RefreshControl, findNodeHandle, UIManager } from "react-native";

export default () => {
    const [searchText, setSearchText] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('Giao Hàng');
    const [topQueries, setTopQueries] = useState<Restaurant[]>([]);
    const [restaurantsStar, setRestaurantsStar] = useState<Restaurant[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const { info } = useAuth();
    const scrollRef = useRef<ScrollView>(null);
    const topQueriesRef = useRef<View>(null);
    const { t } = useTranslation();

    const navigationIcons = [
        { id: 'discount', icon: 'percent', label: t('app.discount'), type: 'MaterialIcons', path: '' },
        { id: 'menu', icon: 'restaurant-menu', label: t('app.menu_ai'), type: 'MaterialIcons', path: '/(home)/menu-ai' },
        { id: 'favorite', icon: 'star-outline', label: t('app.review'), type: 'Ionicons', path: '/(restaurant)/review' },
        { id: 'delivery', icon: 'delivery-dining', label: t('app.top_restaurant'), type: 'MaterialIcons', path: '' },
        { id: 'voucher', icon: 'local-offer', label: t('app.ordered_restaurant'), type: 'MaterialIcons', path: '/(restaurant)/currently-ordered' },
    ];

    // const quickActions = [
    //     { id: 'morning', icon: 'wb-sunny', label: t('app.breakfast'), type: 'MaterialIcons' },
    //     { id: 'drink', icon: 'local-cafe', label: t('app.drink'), type: 'MaterialIcons' },
    //     { id: 'food', icon: 'restaurant', label: t('app.lunch'), type: 'MaterialIcons' },
    //     { id: 'fast', icon: 'fastfood', label: t('app.fast_food'), type: 'MaterialIcons' },
    //     { id: 'call', icon: 'phone', label: t('app.dinner'), type: 'MaterialIcons' },
    //     { id: 'more', icon: 'apps', label: t('app.promotion'), type: 'MaterialIcons' },
    // ];

    const onLoad = async () => {
        setLoading(true);
        const restaurants = await getAllRestaurants(undefined, info?.id);
        setTimeout(() => {
            setTopQueries(restaurants.sort((a, b) => b.rating - a.rating).slice(0, 5));
            setRestaurantsStar(shuffleArray(restaurants).slice(0, 2));
            setLoading(false);
            const nearestRestaurants = restaurants
                .map((r) => ({
                    ...r,
                    distance: haversineDistance(info?.location.latitude ?? 0, info?.location.longitude ?? 0, r.location.latitude, r.location.longitude)
                }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 5);
            setRestaurants(nearestRestaurants);
        }, 500);
    }

    useEffect(() => {
        onLoad();
    }, []);

    const renderIcon = (iconName: string, iconType: string, size = 24, color = '#333') => {
        if (iconType === 'Ionicons') {
            return <Ionicons name={iconName as any} size={size} color={color} />;
        } else if (iconType === 'MaterialIcons') {
            return <MaterialIcons name={iconName as any} size={size} color={color} />;
        } else if (iconType === 'FontAwesome') {
            return <FontAwesome name={iconName as any} size={size} color={color} />;
        }
        return <MaterialIcons name="help" size={size} color={color} />;
    };

    const handleUpdateFavourite = async (restaurantId: string) => {
        if (!info) {
            toast.error(t('app.error'), t('app.unauthorized'));
            return;
        }
        await updateFavourite(info?.id, restaurantId);
        onLoad();
    }

    const scrollToTopQueries = () => {
        const scrollNode = findNodeHandle(scrollRef.current);
        const targetNode = findNodeHandle(topQueriesRef.current);

        if (scrollNode && targetNode) {
            UIManager.measureLayout(
                targetNode,
                scrollNode,
                () => {
                    console.warn('measureLayout failed:');
                },
                (x, y) => {
                    scrollRef.current?.scrollTo({ y: y - 20, animated: true });
                }
            );
        }
    };

    return (
        <ImageBackground source={assets.background.background} style={styles.container}>
            <ScrollView
                ref={scrollRef}
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl onRefresh={onLoad} refreshing={false} />
                }
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={{ width: '20%' }} />
                        <Image source={assets.logo} style={{ height: screen.height * 0.06, width: screen.width * 0.2 }} />
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/(profile)/favourite")}>
                                <Ionicons name="heart-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/(cart)")}>
                                <Ionicons name="cart-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/(notification)")}>
                                <Ionicons name="notifications-outline" size={24} color="white" />
                                {/* <View style={styles.badge}>
                                    <Text style={styles.badgeText}>1</Text>
                                </View> */}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.locationContainer} onPress={() => router.push("/(profile)")}>
                        <Ionicons name="location-outline" size={16} color="#333" />
                        <Text style={styles.locationText}>{info?.address}</Text>
                    </TouchableOpacity>

                    <View style={styles.deliveryInfo}>
                        {
                            [{
                                name: t('app.delivery'),
                                icon: assets.icon.truck
                            }, {
                                name: t('app.take_food'),
                                icon: assets.icon.bag
                            }].map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.deliveryButton, deliveryStatus === item.name && {
                                        borderBottomWidth: 2,
                                        borderBottomColor: "#ED4828"
                                    }]}
                                    onPress={() => setDeliveryStatus(item.name)}
                                >
                                    <Image source={item.icon} />
                                    <Text style={styles.deliveryButtonText}>{item.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t("app.search")}
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* Promotional Banner */}
                <View style={styles.promoBanner}>
                    <Text style={styles.promoTitle}>{t("app.first_order")}</Text>
                </View>

                <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingTop: 20 }}>
                    {/* Burger Promotion */}
                    <BannerCarousel
                        banners={[assets.banner.banner1, assets.banner.banner2, assets.banner.banner3]}
                        onBannerPress={(banner, index) => { }}
                    />

                    {/* Navigation Icons */}
                    <View style={styles.navigationGrid}>
                        {navigationIcons.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.navItem}
                                onPress={() => {
                                    if (item.id === 'delivery') {
                                        scrollToTopQueries();
                                    } else if (item.path) {
                                        router.push(item.path as any);
                                    }
                                }}
                            >
                                {renderIcon(item.icon, item.type, 24, '#333')}
                                <Text style={styles.navLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* <View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} /> */}

                    {/* Quick Actions */}
                    {/* <View style={styles.quickActionsGrid}>
                        {quickActions.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.quickActionItem}>
                                {renderIcon(item.icon, item.type, 24, '#333')}
                                <Text style={styles.quickActionLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View> */}

                    {/* Restaurant Section */}
                    <RestaurantSection
                        restaurantsStar={restaurantsStar}
                        t={t}
                    />

                    {/* Discount Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t("app.sale_20_%")}</Text>
                    </View>

                    {/* Featured Restaurant */}
                    {restaurants.length > 0 &&
                        renderRestaurantCard(shuffleArray(restaurants)[0], true, false, handleUpdateFavourite, t)
                    }

                    {/* Voucher Banner */}
                    <View style={styles.voucherBanner}>
                        <View style={styles.voucherContent}>
                            <Ionicons name="gift-outline" size={24} color="#333" />
                            <View style={styles.voucherText}>
                                <Text style={styles.voucherTitle}>{t("app.save_25_%")}</Text>
                                <Text style={styles.voucherSubtitle}>{t("app.limited")}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableOpacity style={styles.voucherClose}>
                                    <Ionicons name="close" size={20} color="#666" />
                                </TouchableOpacity>
                                <CountdownTimer targetTime="22:51" style={styles.voucherTime} />
                            </View>
                        </View>
                    </View>

                    {/* Top Queries */}
                    <View ref={topQueriesRef} collapsable={false}>
                        <Text style={styles.sectionTitle}>{t("app.top_restaurant")}</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.topQueriesContainer}
                        >
                            {topQueries.map((query) => (
                                <TouchableOpacity
                                    key={query.id}
                                    style={styles.topQueryItem}
                                    onPress={() => router.push({ pathname: '/(restaurant)', params: { id: query.id } })}
                                >
                                    <Image source={{ uri: query.imageUrl }} style={styles.topQueryImage} />
                                    <Text style={styles.topQueryName}>{query.name}</Text>
                                    <Text style={styles.topQueryTime}>10 - 20 {t("app.minutes")}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Menu AI Section */}
                    <TouchableOpacity style={styles.menuAISection} onPress={() => router.push("/(menu-ai)/chat")}>
                        <ImageBackground
                            source={{ uri: 'https://decodingdatascience.com/wp-content/uploads/2023/07/Copy-of-Blue-Dynamic-Fashion-Special-Sale-Banner-1.png' }}
                            style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}
                            imageStyle={{ borderRadius: 12 }}
                        >
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Nearby Restaurants */}
                    <Text style={styles.sectionTitle}>{t("app.near_restaurant")}</Text>
                    {restaurants.map((restaurant) => renderRestaurantCard(restaurant, false, true, handleUpdateFavourite, t))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: 16,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF4444',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    locationText: {
        marginLeft: 4,
        color: '#333',
        fontSize: 19,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 12,
        flexDirection: 'row',
        gap: 10
    },
    deliveryButtonText: {
        color: '#333',
        fontSize: 19,
        fontWeight: '500',
    },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scheduleButtonText: {
        marginLeft: 4,
        color: '#666',
        fontSize: 12,
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        height: 40
    },
    navigationGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    navLabel: {
        marginTop: 4,
        fontSize: 11,
        color: '#333',
        textAlign: 'center',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    quickActionItem: {
        width: '16.666%',
        alignItems: 'center',
        paddingVertical: 12,
    },
    quickActionLabel: {
        marginTop: 4,
        fontSize: 10,
        color: '#333',
        textAlign: 'center',
    },
    promoBanner: {
        margin: 16,
        marginBottom: screen.width * 0.18,
        borderRadius: 12,
        width: '50%'
    },
    promoTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '500',
        lineHeight: 28,
    },
    burgerPromo: {
        backgroundColor: '#FF8C00',
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
        height: 250,
    },
    burgerPromoContent: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
    },
    burgerPromoTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    burgerPromoSubtitle: {
        color: '#fff',
        fontSize: 14,
        marginTop: 4,
    },
    burgerPromoDiscount: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        position: 'absolute',
        right: 16,
        top: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 16,
        marginBottom: 10
    },

    topQueriesContainer: {
        paddingLeft: 16,
        marginTop: 20,
        paddingBlock: 15
    },
    topQueryItem: {
        marginRight: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        backgroundColor: 'white',
        elevation: 8,
        borderRadius: 24,
        position: 'relative',
        paddingTop: 50
    },
    topQueryImage: {
        width: 60,
        height: 60,
        backgroundColor: '#E5E5E5',
        borderRadius: 15,
        position: 'absolute',
        top: -15
    },
    topQueryName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    topQueryTime: {
        fontSize: 10,
        color: '#666',
    },
    menuAISection: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 12,
        alignItems: 'center',
    },
    menuAITitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    voucherBanner: {
        backgroundColor: '#7DD3C0',
        margin: 16,
        borderRadius: 12,
        position: 'relative',
    },
    voucherContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    voucherText: {
        flex: 1,
        marginLeft: 12,
    },
    voucherTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    voucherSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    voucherTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    voucherClose: {

    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
        paddingBottom: 8,
    },
    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
    },
    bottomNavLabel: {
        marginTop: 4,
        fontSize: 10,
        color: '#333',
    },
});