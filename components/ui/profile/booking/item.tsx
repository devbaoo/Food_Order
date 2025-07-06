import { updateBookingStatus } from "@/api/modules/booking";
import { restoreVoucherForBooking } from "@/api/modules/voucher";
import { Booking } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TFunction } from "i18next";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";

export const renderBookingItem = ({
    item,
    setSelectedBooking,
    reload,
    t
}: {
    item: Booking,
    setSelectedBooking: (item: Booking) => void,
    reload: () => void,
    t: TFunction<"translation", undefined>
}) => {
    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'Pending': return '#FFA500';
            case 'Processing': return '#2196F3';
            case 'Shipping': return '#9C27B0';
            case 'Delivered': return '#4CAF50';
            case 'Cancelled': return '#F44336';
            default: return '#757575';
        }
    };

    const getStatusIcon = (status: Booking['status']) => {
        switch (status) {
            case 'Pending': return 'time-outline';
            case 'Processing': return 'refresh-outline';
            case 'Shipping': return 'car-outline';
            case 'Delivered': return 'checkmark-circle-outline';
            case 'Cancelled': return 'close-circle-outline';
            default: return 'help-circle-outline';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const cancelBooking = async (bookingId: string) => {
        Alert.alert(
            t('app.cancel_order'),
            t('app.are_you_sure_cancel_this_order'),
            [
                { text: t('app.no'), style: 'cancel' },
                {
                    text: t('app.yes'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Mock API call - replace with actual API
                            const isSuccess = await updateBookingStatus(bookingId, "Cancelled");
                            if(isSuccess) {
                                await restoreVoucherForBooking(bookingId);
                            }
                            setTimeout(() => {
                                Alert.alert(t('app.success'), t('app.booking_canceled'));
                                reload();
                            }, 500);
                        } catch (error) {
                            Alert.alert(t('app.error'), t('app.failed_to_cancel_booking'));
                        }
                    }
                }
            ]
        );
    };

    return (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => {
                if (item.status === "Shipping") {
                    router.push("/(cart)/delivery");
                } else if(item.status === "Cancelled" || item.status === "Delivered") {
                    router.push({
                        pathname: '/(cart)/rating',
                        params: { bookingId: item.id }
                    })
                }
            }}
        >
            <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>#{item.id.slice(0, 6)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Ionicons name={getStatusIcon(item.status)} size={16} color="white" />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                    <Text style={styles.itemCount}>{item.items.length} {t('app.dish')}</Text>
                </View>
                <Text style={styles.totalPrice}>{formatCurrency(item.totalPrice)}</Text>
            </View>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>

            {(item.status === 'Pending' || item.status === 'Processing') && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelBooking(item.id)}
                >
                    <Text style={styles.cancelButtonText}>{t('app.cancel_order')}</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bookingId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
})