import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { getRestaurantByUserId } from '@/api/modules/restaurant';
import { router } from 'expo-router';
import BackgroundLoading from '@/components/loading/background';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default () => {
    const { restaurant, user, setRestaurant } = useAuth();
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    const checkRestaurant = async () => {
        if (!restaurant && user) {
            try {
                setLoading(true);
                const result = await getRestaurantByUserId(user?.uid);
                if (!result) {
                    setTimeout(() => router.push('/(seller)/register-restaurant'), 1000);
                }
                else {
                    setRestaurant(result);
                }
            }
            finally {
                setTimeout(() => setLoading(false), 1000);
            }
        }
    }

    useEffect(() => {
        checkRestaurant();
    }, []);

    // Sample data
    const todayStats = {
        orders: 0,
        revenue: 0,
        visitors: 0,
        products: 0
    };

    const recentOrders = [
        { id: '#12345', customer: 'John Doe', amount: 45.50, status: 'pending', time: '2 min ago' },
        { id: '#12344', customer: 'Jane Smith', amount: 32.00, status: 'confirmed', time: '15 min ago' },
        { id: '#12343', customer: 'Mike Johnson', amount: 78.25, status: 'delivered', time: '1 hour ago' },
    ];

    const quickActions: any[] = [
        { icon: 'add-circle', label: 'Add Product', color: '#FF6B6B' },
        { icon: 'receipt', label: 'Orders', color: '#4ECDC4' },
        { icon: 'bar-chart', label: 'Analytics', color: '#45B7D1' },
        { icon: 'settings', label: 'Settings', color: '#96CEB4' },
        { icon: 'storefront', label: 'My Store', color: '#FECA57' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFA726';
            case 'confirmed': return '#66BB6A';
            case 'delivered': return '#42A5F5';
            default: return '#757575';
        }
    };

    const StatCard = ({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={styles.statContent}>
                <View>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statTitle}>{title}</Text>
                </View>
                <Ionicons name={icon} size={24} color={color} />
            </View>
        </View>
    );

    const OrderItem = ({ order }: any) => (
        <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderTime}>{order.time}</Text>
            </View>
            <Text style={styles.customerName}>{order.customer}</Text>
            <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2C7A7B" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.welcomeText}>{t("app.welcome_back")}</Text>
                        <Text style={styles.storeName}>{restaurant?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color="white" />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Today's Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("app.today_overview")}</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            title="Orders"
                            value={todayStats.orders}
                            icon="receipt-outline"
                            color="#FF6B6B"
                        />
                        <StatCard
                            title="Revenue"
                            value={`$${todayStats.revenue}`}
                            icon="trending-up-outline"
                            color="#4ECDC4"
                        />
                        <StatCard
                            title="Visitors"
                            value={todayStats.visitors}
                            icon="eye-outline"
                            color="#45B7D1"
                        />
                        <StatCard
                            title="Products"
                            value={todayStats.products}
                            icon="cube-outline"
                            color="#96CEB4"
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("app.quick_actions")}</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.quickActionsContainer}
                    >
                        {quickActions.map((action, index) => (
                            <TouchableOpacity key={index} style={styles.quickActionItem}>
                                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                                    <Ionicons name={action.icon} size={24} color="white" />
                                </View>
                                <Text style={styles.quickActionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Orders */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t("app.recent_order")}</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>{t("app.view_all")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ordersContainer}>
                        {recentOrders.map((order, index) => (
                            <OrderItem key={index} order={order} />
                        ))}
                    </View>
                </View>

                {/* Promotional Banner */}
                <View style={styles.section}>
                    <View style={styles.promoBanner}>
                        <View style={styles.promoContent}>
                            <Text style={styles.promoTitle}>{t("app.boost_your_sales")}</Text>
                            <Text style={styles.promoSubtitle}>
                                {t("app.upgrade_to_premium")}
                            </Text>
                            <TouchableOpacity style={styles.promoButton}>
                                <Text style={styles.promoButtonText}>{t("app.learn_more")}</Text>
                            </TouchableOpacity>
                        </View>
                        <Ionicons name="rocket" size={48} color="#FFD93D" />
                    </View>
                </View>
            </ScrollView>

            {loading && <BackgroundLoading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#2C7A7B',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        color: 'white',
        fontSize: 14,
        opacity: 0.8,
    },
    storeName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
    },
    notificationButton: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAllText: {
        color: '#2C7A7B',
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        width: (width - 50) / 2,
        marginBottom: 10,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    statTitle: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
    },
    quickActionsContainer: {
        paddingVertical: 5,
    },
    quickActionItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    quickActionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionLabel: {
        fontSize: 12,
        color: '#4A5568',
        textAlign: 'center',
        maxWidth: 60,
    },
    ordersContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 5,
    },
    orderItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    orderTime: {
        fontSize: 12,
        color: '#718096',
    },
    customerName: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 10,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C7A7B',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    promoBanner: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 5,
    },
    promoSubtitle: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 15,
        lineHeight: 20,
    },
    promoButton: {
        backgroundColor: '#2C7A7B',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    navTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    navLabel: {
        fontSize: 12,
        marginTop: 4,
    },
});