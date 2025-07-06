import { getAllBookings } from '@/api/modules/booking';
import assets from '@/assets';
import BackgroundLoading2 from '@/components/loading/background_2';
import { renderBookingItem } from '@/components/ui/profile/booking/item';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Booking } from '@/types';
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
    FlatList,
} from 'react-native';

const OrdersScreen = () => {
    const { info } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const { t } = useTranslation();

    const handleBackPress = () => {
        // Handle back navigation
        router.back();
    };

    const handleNotificationPress = () => {
        // Handle notification press
        console.log('Notification pressed');
    };

    const onLoad = async () => {
        setLoading(true);
        const bookings = await getAllBookings(info?.id ?? "");
        setTimeout(() => {
            setBookings(bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            setLoading(false);
        }, 500);
    }

    useEffect(() => {
        if (info) onLoad();
    }, [info]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{t('app.order')}</Text>

                <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                    <MaterialIcons name="notifications-none" size={24} color="#333" />
                    {/* Notification badge */}
                    <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>1</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {
                loading ?
                    <View style={{ flex: 1 }}>
                        <BackgroundLoading2 />
                    </View>
                    :
                    bookings.length <= 0 ?
                        <View style={styles.emptyStateContainer}>
                            {/* Logo Placeholder - You can replace this with your actual logo */}
                            <View style={styles.logoContainer}>
                                <Image source={assets.logo} style={{ height: screen.height * 0.09, objectFit: 'contain' }} />
                            </View>

                            {/* Empty State Text */}
                            <Text style={styles.emptyTitle}>{t('app.order_empty')}</Text>
                            <Text style={styles.emptySubtitle}>
                                {t('app.order_empty_subscription')}
                            </Text>
                        </View>
                        :
                        <FlatList
                            data={bookings}
                            renderItem={({ item }) => renderBookingItem({ item, setSelectedBooking, reload: onLoad, t })}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 16 }}
                            refreshing={loading}
                            onRefresh={onLoad}
                        />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
        marginRight: 40, // Compensate for notification button width
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
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
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
    },
});

export default OrdersScreen;