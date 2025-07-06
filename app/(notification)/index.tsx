import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function () {
    const [notifications, setNotifications] = useState<any>([]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'info':
                return 'information-circle';
            case 'message':
                return 'mail';
            case 'update':
                return 'download';
            case 'success':
                return 'checkmark-circle';
            case 'warning':
                return 'warning';
            default:
                return 'notifications';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'info':
                return '#007AFF';
            case 'message':
                return '#34C759';
            case 'update':
                return '#FF9500';
            case 'success':
                return '#34C759';
            case 'warning':
                return '#FF3B30';
            default:
                return '#8E8E93';
        }
    };

    const markAsRead = (id: any) => {

    };

    const deleteNotification = (id: any) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {

                    },
                },
            ]
        );
    };

    const markAllAsRead = () => {

    };

    const clearAllNotifications = () => {
        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to clear all notifications?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => setNotifications([]),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
                {/* {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )} */}
                <View style={{ width: 24 }} />
            </View>

            {/* Action Buttons */}
            {notifications.length > 0 && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.markAllButton]}
                        onPress={markAllAsRead}
                    >
                        <Ionicons name="checkmark-done" size={16} color="#007AFF" />
                        <Text style={styles.actionButtonText}>Mark All Read</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.clearAllButton]}
                        onPress={clearAllNotifications}
                    >
                        <Ionicons name="trash" size={16} color="#FF3B30" />
                        <Text style={[styles.actionButtonText, styles.clearAllText]}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Notifications List */}
            <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off" size={64} color="#C7C7CC" />
                        <Text style={styles.emptyStateTitle}>Không có thông báo</Text>
                        <Text style={styles.emptyStateMessage}>
                            Bạn đã cập nhật đầy đủ! Thông báo mới sẽ xuất hiện ở đây.
                        </Text>
                    </View>
                ) : (
                    notifications.map((notification: any) => (
                        <TouchableOpacity
                            key={notification.id}
                            style={[
                                styles.notificationItem,
                                !notification.read && styles.unreadNotification,
                            ]}
                            onPress={() => markAsRead(notification.id)}
                        >
                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={getNotificationIcon(notification.type)}
                                            size={20}
                                            color={getNotificationColor(notification.type)}
                                        />
                                    </View>
                                    <View style={styles.notificationText}>
                                        <Text style={styles.notificationTitle}>
                                            {notification.title}
                                        </Text>
                                        <Text style={styles.notificationMessage}>
                                            {notification.message}
                                        </Text>
                                        <Text style={styles.notificationTime}>
                                            {notification.time}
                                        </Text>
                                    </View>
                                    {!notification.read && (
                                        <View style={styles.unreadIndicator} />
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteNotification(notification.id)}
                            >
                                <Ionicons name="close" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        paddingTop: StatusBar.currentHeight || 0
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    badge: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    markAllButton: {
        backgroundColor: '#E3F2FD',
    },
    clearAllButton: {
        backgroundColor: '#FFEBEE',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
        color: '#007AFF',
    },
    clearAllText: {
        color: '#FF3B30',
    },
    notificationsList: {
        flex: 1,
    },
    notificationItem: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unreadNotification: {
        backgroundColor: '#F8F9FF',
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    notificationContent: {
        flex: 1,
        padding: 16,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationText: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 6,
    },
    notificationTime: {
        fontSize: 12,
        color: '#8E8E93',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginLeft: 8,
    },
    deleteButton: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 80,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateMessage: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
    },
});