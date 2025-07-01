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

    const onLoad = async () => {
        setLoading(true);
        try {
            const orders = await getBookingByRestaurantId(restaurant?.id ?? "");
            if (orders && orders.length > 0) {
                setOrders(orders);
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

    const filteredOrders: Booking[] = orders.filter(order => {
        if (activeTab === 'All') return true;
        return order.status === activeTab;
    });

    const updateOrderStatus = async (orderId: string, newStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
        setEditting(true);
        try {
            await updateBookingStatus(orderId, newStatus);
        } finally {
            setEditting(false);
        }
        Alert.alert('Success', 'Order status updated successfully');
        await onLoad();
    };

    const addTrackingNumber = (orderId: string, tracking: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, trackingNumber: tracking } : order
        ));
        setTrackingNumber('');
        setModalVisible(false);
        Alert.alert('Success', 'Tracking number added successfully');
    };

    const OrderCard = (order: Booking) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>#{order.id.slice(6)}</Text>
                    <Text style={styles.customerName}>{`{{customerName}}`}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Feather name={getStatusIcon(order.status)} size={12} color="white" />
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <Text style={styles.orderDate}>Order Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.totalAmount}>Total: {formatCurrency(order.totalPrice)}</Text>
            </View>

            <View style={styles.itemsList}>
                {order.items.map((item: any, index: number) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>{`{{productName}}`}</Text>
                        <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                    </View>
                ))}
            </View>

            {order.id && (
                <View style={styles.trackingInfo}>
                    <Feather name="package" size={16} color="#007AFF" />
                    <Text style={styles.trackingText}>Tracking: {order.id}</Text>
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
                    <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>

                {order.status === 'Pending' && (
                    <TouchableOpacity
                        style={styles.processButton}
                        onPress={() => updateOrderStatus(order.id, 'Processing')}
                        disabled={editting}
                    >
                        {editting && <ActivityIndicator size={18} color="white" />}
                        <Text style={styles.buttonText}>Process Order</Text>
                    </TouchableOpacity>
                )}

                {order.status === 'Processing' && (
                    <TouchableOpacity
                        style={styles.shipButton}
                        onPress={() => updateOrderStatus(order.id, 'Shipped')}
                        disabled={editting}
                    >
                        {editting && <ActivityIndicator size={18} color="white" />}
                        <Text style={styles.buttonText}>Mark as Shipped</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const OrderDetailModal = () => (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Feather name="x" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Order Details</Text>
                    <View style={{ width: 24 }} />
                </View>

                {selectedOrder && (
                    <ScrollView style={styles.modalContent}>
                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>Order Information</Text>
                            <Text style={styles.detailText}>Order ID: #{selectedOrder.id}</Text>
                            <Text style={styles.detailText}>Date: {selectedOrder.createdAt}</Text>
                            <Text style={styles.detailText}>Status: {selectedOrder.status}</Text>
                            <Text style={styles.detailText}>Total: ${selectedOrder.totalPrice.toFixed(2)}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>Customer Information</Text>
                            <Text style={styles.detailText}>Name: {selectedOrder.customerName}</Text>
                            <Text style={styles.detailText}>Email: {selectedOrder.customerEmail}</Text>
                            <Text style={styles.detailText}>Payment: {selectedOrder.paymentMethod}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>Shipping Address</Text>
                            <Text style={styles.detailText}>{selectedOrder.shippingAddress}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>Items Ordered</Text>
                            {selectedOrder.items.map((item: any, index: number) => (
                                <View key={index} style={styles.modalItemRow}>
                                    <Text style={styles.modalItemName}>{item.name}</Text>
                                    <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
                                    <Text style={styles.detailText}>Price: ${item.price.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>

                        {!selectedOrder.trackingNumber && selectedOrder.status === 'processing' && (
                            <View style={styles.detailSection}>
                                <Text style={styles.sectionTitle}>Add Tracking Number</Text>
                                <TextInput
                                    style={styles.trackingInput}
                                    placeholder="Enter tracking number"
                                    value={trackingNumber}
                                    onChangeText={setTrackingNumber}
                                />
                                <TouchableOpacity
                                    style={styles.addTrackingButton}
                                    onPress={() => addTrackingNumber(selectedOrder.id, trackingNumber)}
                                >
                                    <Text style={styles.buttonText}>Add Tracking</Text>
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
                <Text style={styles.headerTitle}>Order Management</Text>
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
                        <Text style={styles.emptyText}>No orders found</Text>
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
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    detailSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    modalItemRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    trackingInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    addTrackingButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});