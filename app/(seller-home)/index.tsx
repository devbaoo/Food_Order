import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Modal,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { getRestaurantByUserId } from '@/api/modules/restaurant';
import { router } from 'expo-router';
import BackgroundLoading from '@/components/loading/background';
import { useTranslation } from 'react-i18next';
import { Booking, Food } from '@/types';
import { getBookingByRestaurantId } from '@/api/modules/booking';
import { getAllFoodsByRestaurantId } from '@/api/modules/food';
import moment from 'moment';
import { formatCurrency } from '@/utils/currency';
import { revenueData } from '@/data/dashboard';

const { width } = Dimensions.get('window');

export default () => {
    const { restaurant, user, setRestaurant } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [showOrderStats, setShowOrderStats] = useState(false);
    const [showRevenueChart, setShowRevenueChart] = useState(false);
    const [showBestSellers, setShowBestSellers] = useState(false);
    const [showOrderFilter, setShowOrderFilter] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');
    const { t } = useTranslation();

    const onLoad = async () => {
        setDashboardLoading(true);
        try {
            const [bookings, foods] = await Promise.all([
                getBookingByRestaurantId(restaurant?.id ?? ""),
                getAllFoodsByRestaurantId(restaurant?.id ?? "")
            ])

            setBookings(bookings);
            setFoods(foods);
        } finally {
            setDashboardLoading(false);
        }
    }

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

    useEffect(() => {
        if (restaurant) onLoad();
    }, [restaurant]);

    // Enhanced stats with period-based data
    type Period = 'today' | 'week' | 'month';
    const getStatsForPeriod = (period: Period) => {
        const statsData = {
            today: {
                orders: bookings.filter(x => moment(x.createdAt).isSame(moment(), 'day') && x.status === "Delivered").length,
                revenue: bookings
                    .filter(x => moment(x.createdAt).isSame(moment(), 'day') && x.status === "Delivered")
                    .reduce((sum, order) => sum + order.totalPrice, 0),
                visitors: bookings.filter(x => moment(x.createdAt).isSame(moment(), 'day')).length,
                products: foods.length
            },
            week: {
                orders: bookings.filter(x => moment(x.createdAt).isSame(moment(), 'week') && x.status === "Delivered").length,
                revenue: bookings
                    .filter(x => moment(x.createdAt).isSame(moment(), 'week') && x.status === "Delivered")
                    .reduce((sum, order) => sum + order.totalPrice, 0),
                visitors: bookings.filter(x => moment(x.createdAt).isSame(moment(), 'week')).length,
                products: foods.length
            },
            month: {
                orders: bookings.filter(x => moment(x.createdAt).isSame(moment(), 'month') && x.status === "Delivered").length,
                revenue: bookings
                    .filter(x => moment(x.createdAt).isSame(moment(), 'month') && x.status === "Delivered")
                    .reduce((sum, order) => sum + order.totalPrice, 0),
                visitors: 1250,
                products: bookings.filter(x => moment(x.createdAt).isSame(moment(), 'month')).length
            },
        };
        return statsData[period] || statsData.today;
    };

    const todayStats = getStatsForPeriod(selectedPeriod);

    const [statusFilter, setStatusFilter] = useState('All');
    const filteredOrders = statusFilter === 'All' ? bookings : bookings.filter(order => order.status === statusFilter);

    const quickActions: any[] = [
        { icon: 'add-circle', label: t("app.add_product"), color: '#FF6B6B', action: () => router.push("/(seller-home)/product") },
        { icon: 'receipt', label: t("app.order"), color: '#4ECDC4', action: () => setShowOrderFilter(true) },
        { icon: 'bar-chart', label: t("app.analytics"), color: '#45B7D1', action: () => setShowRevenueChart(true) },
        { icon: 'settings', label: t("app.settings"), color: '#96CEB4', action: () => router.push("/(seller-home)/profile") },
        { icon: 'storefront', label: t("app.my_store"), color: '#FECA57', action: () => { } },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return '#FFA726';
            case 'Processing': return '#66BB6A';
            case 'Shipping': return '#42A5F5';
            case 'Delivered': return '#4CAF50';
            case 'Cancelled': return '#F44336';
            default: return '#757575';
        }
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return 'trending-up';
            case 'down': return 'trending-down';
            case 'stable': return 'remove';
            default: return 'remove';
        }
    };

    const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return '#4CAF50';
            case 'down': return '#F44336';
            case 'stable': return '#FF9800';
            default: return '#757575';
        }
    };

    type StatCardProps = {
        title: string;
        value: string | number;
        icon: keyof typeof Ionicons.glyphMap;
        color: string;
        onPress?: () => void;
    };

    const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onPress }) => (
        <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
            <View style={styles.statContent}>
                <View style={{ alignItems: 'flex-start' }}>
                    {dashboardLoading ?
                        <ActivityIndicator size={30} color="black" />
                        :
                        <Text style={styles.statValue}>{value}</Text>}
                    <Text style={styles.statTitle}>{title}</Text>
                </View>
                <Ionicons name={icon} size={24} color={color} />
            </View>
        </TouchableOpacity>
    );

    const OrderItem: React.FC<{ order: Booking }> = ({ order }) => (
        <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id.slice(0, 6)}</Text>
                <Text style={styles.orderTime}>{new Date(order.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.customerName}>{order.customer?.name}</Text>
            <Text style={styles.orderItems}>{foods.length > 0 && order.items.map(item => foods.find(x => x.id === item.foodId)?.name).join(', ')}</Text>
            <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>{formatCurrency(order.totalPrice ?? 0)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
            </View>
        </View>
    );

    const BestSellerItem: React.FC<{ item: Food; index: number }> = ({ item, index }) => (
        <View style={styles.bestSellerItem}>
            <View style={styles.bestSellerRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            <View style={styles.bestSellerInfo}>
                <Text style={styles.bestSellerName}>{item.name}</Text>
                <Text style={styles.bestSellerStats}>{12} sold • {formatCurrency(item.basePrice)}</Text>
            </View>
            <View style={styles.bestSellerTrend}>
                <Ionicons
                    name={getTrendIcon("stable")}
                    size={20}
                    color={getTrendColor("stable")}
                />
            </View>
        </View>
    );

    type RevenueChartDataItem = { time?: string; day?: string; week?: string; revenue: number };
    const RevenueChart: React.FC<{ data: RevenueChartDataItem[] }> = ({ data }) => {
        const maxRevenue = Math.max(...data.map(item => item.revenue || 0));

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Revenue Overview</Text>
                <View style={styles.chart}>
                    {data.map((item, index) => {
                        const height = (item.revenue / maxRevenue) * 150;
                        const label = item.time || item.day || item.week;

                        return (
                            <View key={index} style={styles.chartBar}>
                                <View style={styles.chartBarContainer}>
                                    <View
                                        style={[
                                            styles.chartBarFill,
                                            { height: height, backgroundColor: '#2C7A7B' }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.chartLabel}>{label}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const PeriodSelector = () => (
        <View style={styles.periodSelector}>
            {['today', 'week', 'month'].map(period => (
                <TouchableOpacity
                    key={period}
                    style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.periodButtonActive
                    ]}
                    onPress={() => setSelectedPeriod(period as Period)}
                >
                    <Text style={[
                        styles.periodButtonText,
                        selectedPeriod === period && styles.periodButtonTextActive
                    ]}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const StatusFilter = () => (
        <View style={styles.statusFilter}>
            {['All', 'Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'].map(status => (
                <TouchableOpacity
                    key={status}
                    style={[
                        styles.statusButton,
                        statusFilter === status && styles.statusButtonActive
                    ]}
                    onPress={() => setStatusFilter(status)}
                >
                    <Text style={[
                        styles.statusButtonText,
                        statusFilter === status && styles.statusButtonTextActive
                    ]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
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
                <PeriodSelector />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onLoad} />
                }
            >
                {/* Today's Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("app.today_overview")}</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            title={t("app.order")}
                            value={todayStats.orders}
                            icon="receipt-outline"
                            color="#FF6B6B"
                            onPress={() => setShowOrderStats(true)}
                        />
                        <StatCard
                            title={t("app.revenue")}
                            value={`${formatCurrency(todayStats.revenue)}`}
                            icon="trending-up-outline"
                            color="#4ECDC4"
                            onPress={() => setShowRevenueChart(true)}
                        />
                        <StatCard
                            title={t("app.visitors")}
                            value={todayStats.visitors}
                            icon="eye-outline"
                            color="#45B7D1"
                        />
                        <StatCard
                            title={t("app.products")}
                            value={todayStats.products}
                            icon="cube-outline"
                            color="#96CEB4"
                            onPress={() => setShowBestSellers(true)}
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
                            <TouchableOpacity
                                key={index}
                                style={styles.quickActionItem}
                                onPress={action.action}
                            >
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
                        <TouchableOpacity onPress={() => setShowOrderFilter(true)}>
                            <Text style={styles.viewAllText}>{t("app.view_all")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ordersContainer}>
                        {filteredOrders.slice(0, 3).map((order, index) => (
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

            {/* Order Stats Modal */}
            <Modal
                visible={showOrderStats}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOrderStats(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t("app.order_statistic")}</Text>
                            <TouchableOpacity onPress={() => setShowOrderStats(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.statsDetailContainer}>
                            <View style={styles.statDetail}>
                                <Text style={styles.statDetailLabel}>{t("app.total_order")}</Text>
                                <Text style={styles.statDetailValue}>{todayStats.orders}</Text>
                            </View>
                            <View style={styles.statDetail}>
                                <Text style={styles.statDetailLabel}>{t("app.average_revenue")}</Text>
                                <Text style={styles.statDetailValue}>{formatCurrency((todayStats.revenue / todayStats.orders || 0))}</Text>
                            </View>
                            <View style={styles.statDetail}>
                                <Text style={styles.statDetailLabel}>{t("app.conversion_rate")}</Text>
                                <Text style={styles.statDetailValue}>{((todayStats.orders / todayStats.visitors) * 100 || 0).toFixed(1)}%</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Revenue Chart Modal */}
            <Modal
                visible={showRevenueChart}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowRevenueChart(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t("app.revenue_chart")}</Text>
                            <TouchableOpacity onPress={() => setShowRevenueChart(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <RevenueChart data={revenueData[selectedPeriod]} />
                    </View>
                </View>
            </Modal>

            {/* Best Sellers Modal */}
            <Modal
                visible={showBestSellers}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowBestSellers(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t("app.best_selling_item")}</Text>
                            <TouchableOpacity onPress={() => setShowBestSellers(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.bestSellersContainer}>
                            {foods.map((item, index) => (
                                <BestSellerItem
                                    key={index}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Order Filter Modal */}
            <Modal
                visible={showOrderFilter}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOrderFilter(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t("app.all_orders")}</Text>
                            <TouchableOpacity onPress={() => setShowOrderFilter(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <StatusFilter />
                        <ScrollView style={styles.ordersContainer}>
                            {filteredOrders.map((order, index) => (
                                <OrderItem key={index} order={order} />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
        marginBottom: 15,
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
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 4,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: 'white',
    },
    periodButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    periodButtonTextActive: {
        color: '#2C7A7B',
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
        maxHeight: 400,
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
        marginBottom: 5,
    },
    orderItems: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 10,
        fontStyle: 'italic',
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
    statusFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
        gap: 8,
    },
    statusButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#E2E8F0',
    },
    statusButtonActive: {
        backgroundColor: '#2C7A7B',
    },
    statusButtonText: {
        fontSize: 12,
        color: '#4A5568',
    },
    statusButtonTextActive: {
        color: 'white',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: width * 0.9,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    statsDetailContainer: {
        gap: 15,
    },
    statDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    statDetailLabel: {
        fontSize: 16,
        color: '#4A5568',
    },
    statDetailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C7A7B',
    },
    chartContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 15,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 15,
        textAlign: 'center',
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
    },
    chartBarContainer: {
        height: 150,
        width: 20,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        justifyContent: 'flex-end',
        marginBottom: 5,
    },
    chartBarFill: {
        width: '100%',
        borderRadius: 10,
        minHeight: 5,
    },
    chartLabel: {
        fontSize: 10,
        color: '#4A5568',
        textAlign: 'center',
        marginTop: 5,
    },
    bestSellersContainer: {
        maxHeight: 400,
    },
    bestSellerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    bestSellerRank: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2C7A7B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rankNumber: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bestSellerInfo: {
        flex: 1,
    },
    bestSellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    bestSellerStats: {
        fontSize: 14,
        color: '#718096',
    },
    bestSellerTrend: {
        marginLeft: 10,
    },
});