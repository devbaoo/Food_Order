import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    Modal,
    TextInput,
    RefreshControl,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getBookingByRestaurantId, updateBookingStatus } from '@/api/modules/booking';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Booking } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/currency';

export default function OrderScreen() {
    const { restaurant } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState<boolean>(true);
    const [editting, setEditting] = useState<boolean>(false);
    const { t } = useTranslation();

    const customOrder = {
        'Shipping': 0,
        'Processing': 2,
        'Pending': 1,
        'Delivered': 3,
        'Cancelled': 4
    };

    const onLoad = async () => {
        setLoading(true);
        try {
            const orders = await getBookingByRestaurantId(restaurant?.id ?? "");
            if (orders && orders.length > 0) {
                setOrders(orders.sort((a, b) => customOrder[a.status] - customOrder[b.status]));
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (restaurant) {
            onLoad();
        }
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return '#FF9500';
            case 'Processing': return '#007AFF';
            case 'Shipped': return '#34C759';
            case 'Delivered': return '#00C851';
            case 'Cancelled': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return 'clock';
            case 'Processing': return 'settings';
            case 'Shipped': return 'truck';
            case 'Delivered': return 'check-circle';
            case 'Cancelled': return 'x-circle';
            default: return 'help-circle';
        }
    };

    const getStatusBadgeStyle = (status?: string) => {
        const baseStyle = styles.statusBadge;
        switch (status?.toLowerCase()) {
            case 'Pending':
                return { ...baseStyle, backgroundColor: '#fef3c7' };
            case 'Processing':
                return { ...baseStyle, backgroundColor: '#dbeafe' };
            case 'Shipping':
                return { ...baseStyle, backgroundColor: '#d1fae5' };
            case 'Delivered':
                return { ...baseStyle, backgroundColor: '#dcfce7' };
            case 'Cancelled':
                return { ...baseStyle, backgroundColor: '#fee2e2' };
            default:
                return { ...baseStyle, backgroundColor: '#f3f4f6' };
        }
    };

    // Helper function to get status text styles
    const getStatusTextStyle = (status?: string) => {
        const baseStyle = styles.statusText;
        switch (status?.toLowerCase()) {
            case 'Pending':
                return { ...baseStyle, color: '#92400e' };
            case 'Processing':
                return { ...baseStyle, color: '#1e40af' };
            case 'Shipping':
                return { ...baseStyle, color: '#065f46' };
            case 'Delivered':
                return { ...baseStyle, color: '#166534' };
            case 'Cancelled':
                return { ...baseStyle, color: '#dc2626' };
            default:
                return { ...baseStyle, color: '#6b7280' };
        }
    };

    // Helper function to get customer initials
    const getCustomerInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CU';
    };

    const filteredOrders: Booking[] = orders.filter(order => {
        if (activeTab === 'All') return true;
        return order.status === activeTab;
    });

    const updateOrderStatus = async (orderId: string, newStatus: 'Pending' | 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled') => {
        setEditting(true);
        try {
            await updateBookingStatus(orderId, newStatus);
        } finally {
            setEditting(false);
        }
        Alert.alert(t("app.success"), t("app.updated_order"));
        await onLoad();
    };

    const addTrackingNumber = (orderId: string, tracking: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, trackingNumber: tracking } : order
        ));
        setTrackingNumber('');
        setModalVisible(false);
        Alert.alert(t("app.success"), t("app.added_tracking_number"));
    };

    const OrderCard = (order: Booking) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>#{order.id.slice(0, 6)}</Text>
                    <Text style={styles.customerName}>{order.customer?.name}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Feather name={getStatusIcon(order.status)} size={12} color="white" />
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <Text style={styles.orderDate}>{t("app.order_date")}: {new Date(order.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.totalAmount}>{t("app.total")}: {formatCurrency(order.totalPrice)}</Text>
            </View>

            <View style={styles.itemsList}>
                {order.items.map((item: any, index: number) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQty}>{t("app.quantity")}: {item.quantity}</Text>
                        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                    </View>
                ))}
            </View>

            {order.id && (
                <View style={styles.trackingInfo}>
                    <Feather name="package" size={16} color="#007AFF" />
                    <Text style={styles.trackingText}>{t("app.tracking")}: {order.id}</Text>
                </View>
            )}

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                        setSelectedOrder(order);
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.buttonText}>{t("app.view_detail")}</Text>
                </TouchableOpacity>

                {order.status === 'Pending' && (
                    <TouchableOpacity
                        style={styles.processButton}
                        onPress={() => updateOrderStatus(order.id, 'Processing')}
                        disabled={editting}
                    >
                        {editting && <ActivityIndicator size={18} color="white" />}
                        <Text style={styles.buttonText}>{t("app.process_order")}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const OrderDetailModal = () => (
        <Modal
            animationType="fade"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                        activeOpacity={0.7}
                    >
                        <Feather name="x" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{t("app.order_details")}</Text>
                    <View style={{ width: 36 }} />
                </View>

                {selectedOrder && (
                    <ScrollView
                        style={styles.modalContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Order Information */}
                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>{t("app.order_information")}</Text>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{t("app.order_id")}</Text>
                                <Text style={styles.detailValue}>#{selectedOrder.id}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{t("app.date")}</Text>
                                <Text style={styles.detailValue}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{t("app.status")}</Text>
                                <View style={getStatusBadgeStyle(selectedOrder.status)}>
                                    <Text style={getStatusTextStyle(selectedOrder.status)}>
                                        {selectedOrder.status}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { fontSize: 16, fontWeight: '600' }]}>{t("app.total")}</Text>
                                <Text style={styles.totalPrice}>{formatCurrency(selectedOrder.totalPrice)}</Text>
                            </View>
                        </View>

                        {/* Customer Information */}
                        <View style={styles.customerSection}>
                            <Text style={styles.sectionTitle}>{t("app.customer_information")}</Text>

                            <View style={styles.customerInfo}>
                                <View style={styles.customerAvatar}>
                                    <Text style={styles.customerInitials}>
                                        {getCustomerInitials(selectedOrder?.customer?.name)}
                                    </Text>
                                </View>
                                <View style={styles.customerDetails}>
                                    <Text style={styles.customerName}>{selectedOrder?.customer?.name}</Text>
                                    <Text style={styles.customerPhone}>{selectedOrder?.customer?.phone}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{t("app.payment_method")}</Text>
                                <Text style={styles.detailValue}>{selectedOrder.paymentMethod ?? "VNPay"}</Text>
                            </View>
                        </View>

                        {/* Shipping Address */}
                        <View style={styles.addressSection}>
                            <Text style={styles.sectionTitle}>{t("app.shipping_address")}</Text>
                            <Text style={styles.addressText}>{selectedOrder?.customer?.address}</Text>
                        </View>

                        {/* Items Ordered */}
                        <View style={styles.itemsSection}>
                            <Text style={styles.sectionTitle}>{t("app.items_ordered")}</Text>
                            {selectedOrder.items.map((item: any, index: number) => (
                                <View key={index} style={styles.modalItemRow}>
                                    <View style={styles.modalItemInfo}>
                                        <Text style={styles.modalItemName}>{item.name}</Text>
                                        <Text style={styles.modalItemQuantity}>{t("app.quantity")}: {item.quantity}</Text>
                                    </View>
                                    <Text style={styles.modalItemPrice}>{formatCurrency(item.price)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Tracking Number Section */}
                        {!selectedOrder.trackingNumber && selectedOrder.status === 'Processing' && (
                            <View style={styles.trackingSection}>
                                <Text style={styles.trackingTitle}>{t("app.add_tracking_number")}</Text>
                                <TextInput
                                    style={styles.trackingInput}
                                    placeholder={t("app.enter_tracking_number")}
                                    value={trackingNumber}
                                    onChangeText={setTrackingNumber}
                                    placeholderTextColor="#9ca3af"
                                />
                                <TouchableOpacity
                                    style={styles.addTrackingButton}
                                    onPress={() => addTrackingNumber(selectedOrder.id, trackingNumber)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>{t("app.add_tracking_number")}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t("app.order_management")}</Text>
                <TouchableOpacity onPress={onLoad}>
                    <Feather name="refresh-cw" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.ordersList}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onLoad} />}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                {filteredOrders.map(order => (
                    <OrderCard key={order.id} {...order} />
                ))}

                {filteredOrders.length === 0 && (
                    <View style={styles.emptyState}>
                        <Feather name="inbox" size={48} color="#8E8E93" />
                        <Text style={styles.emptyText}>{t("app.no_orders_found")}</Text>
                    </View>
                )}
            </ScrollView>

            <OrderDetailModal />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: 48
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeTab: {
        backgroundColor: '#007AFF',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    ordersList: {
        flex: 1,
        padding: 20,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    customerName: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    itemsList: {
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    itemQty: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 8,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    trackingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 8,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
    },
    trackingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#007AFF',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    viewButton: {
        flex: 1,
        backgroundColor: '#a0a0a0',
        paddingVertical: 10,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    processButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center'
    },
    shipButton: {
        flex: 1,
        backgroundColor: '#34C759',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 5,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    detailSection: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#1e293b',
        letterSpacing: -0.3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#059669',
    },
    customerSection: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    customerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    customerInitials: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    customerDetails: {
        flex: 1,
    },
    customerPhone: {
        fontSize: 14,
        color: '#64748b',
    },
    addressSection: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    addressText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
    },
    itemsSection: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    modalItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalItemInfo: {
        flex: 1,
    },
    modalItemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    modalItemQuantity: {
        fontSize: 13,
        color: '#64748b',
    },
    modalItemPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#059669',
    },
    trackingSection: {
        backgroundColor: '#fef3c7',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    trackingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#92400e',
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    trackingInput: {
        borderWidth: 2,
        borderColor: '#fbbf24',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    addTrackingButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    },
});