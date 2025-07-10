import { getAllBookingsForShipper, updateBookingStatus } from '@/api/modules/booking';
import { checkAndSendNotify } from '@/api/modules/notification';
import BackgroundLoading2 from '@/components/loading/background_2';
import { auth } from '@/lib/firebase-config';
import { Booking } from '@/types';
import { formatCurrency } from '@/utils/currency';
import screen from '@/utils/screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';

export default () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [refreshing, setRefreshing] = useState(true);
    const [editting, setEditting] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        onLoad();
    }, []);

    const updateOrderStatus = async (orderId: string, restaurantId: string, newStatus: 'Pending' | 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled') => {
        Alert.alert(
            t("app.confirm_action"),
            `Bạn có muốn ${newStatus === "Shipping" ? "nhận đơn hàng này" : "xác nhận đã giao hàng"}?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            setEditting(true);
                            await updateBookingStatus(orderId, newStatus);

                            if (newStatus === "Shipping") {
                                await checkAndSendNotify(restaurantId, "Shipper đã nhận đơn", "Bạn có thể theo dõi tiến trình.");
                            } else if (newStatus === "Delivered") {
                                await checkAndSendNotify(restaurantId, "Đơn được giao thành công", "Tiền sẽ được gửi vào tài khoản của bạn.");
                            }

                            Alert.alert(
                                t("app.success"),
                                `Đơn hàng đã được cập nhật sang: ${newStatus}!`
                            );
                        } finally {
                            setEditting(false);
                        }
                        await onLoad();
                    },
                },
            ]
        );
    };

    const customOrder = {
        'Shipping': 0,
        'Processing': 1,
        'Pending': 2
    };

    const onLoad = async () => {
        setRefreshing(true);
        try {
            // Replace with actual API call
            const bookings = await getAllBookingsForShipper();
            setBookings(bookings
                .sort(
                    (a, b) =>
                        customOrder[a.status as keyof typeof customOrder] -
                        customOrder[b.status as keyof typeof customOrder]
                )
            );
        } catch (err) {
            console.log(err);
        } finally {
            setRefreshing(false);
        }
    };

    const getStatusColor = (status: 'Pending' | 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled') => {
        switch (status) {
            case 'Pending':
                return '#3674B5';
            case 'Processing':
                return '#ff9500';
            case 'Shipping':
                return '#007aff';
            case 'Delivered':
                return '#34c759';
            default:
                return '#8e8e93';
        }
    };

    const getButtonText = (status: 'Pending' | 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled') => {
        switch (status) {
            case 'Pending':
                return 'Đợi người bán phản hồi';
            case 'Processing':
                return 'Nhận đơn';
            case 'Shipping':
                return 'Xác nhận đã giao';
            case 'Delivered':
                return 'Hoàn thành';
            default:
                return 'Không biết';
        }
    };

    const renderBookingItem = ({ item }: { item: Booking }) => (
        <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>{t("app.order")} #{item.id.slice(0, 6)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.bookingDetails}>
                <Text style={styles.customerName}>{item?.customer?.name}</Text>
                <Text style={styles.detailText}>📍 {item?.customer?.address}</Text>
                <Text style={styles.detailText}>📞 {item?.customer?.phone}</Text>
                {
                    item.items.map((food, index) => (
                        <Text key={index} style={styles.detailText}>📦 {food?.name}</Text>
                    ))
                }
                <Text style={styles.detailText}>💰 {formatCurrency(item.totalPrice)}</Text>
                <Text style={styles.detailText}>📅 {new Date(item.createdAt).toLocaleString()}</Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.actionButton,
                    {
                        backgroundColor: item.status !== 'Processing' && item.status !== 'Shipping' ? '#8e8e93' : getStatusColor(item.status),
                        opacity: item.status !== 'Processing' && item.status !== 'Shipping' ? 0.6 : 1,
                    },
                ]}
                onPress={async () => await updateOrderStatus(item.id, item.restaurantId, item.status === "Processing" ? "Shipping" : "Delivered")}
                disabled={item.status !== 'Processing' && item.status !== 'Shipping'}
            >
                {editting && <ActivityIndicator size={16} color="white" />}
                <Text style={styles.actionButtonText}>{getButtonText(item.status)}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.headerTitle}>Bảng điều khiển người gửi hàng</Text>
                    <TouchableOpacity
                        style={{ padding: 8, backgroundColor: "gray", borderRadius: screen.width }}
                        onPress={async () => await signOut(auth)}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerSubtitle}>Quản lý việc giao hàng của bạn</Text>
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBookingItem}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={onLoad} />
                    }
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
                        </View>
                    }
                />

                {refreshing && <BackgroundLoading2 />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 12
    },
    header: {
        paddingTop: 32,
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
        maxWidth: '80%'
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 4,
    },
    listContainer: {
        padding: 16
    },
    bookingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    bookingId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    bookingDetails: {
        marginBottom: 16,
    },
    customerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 4,
        lineHeight: 20,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
});