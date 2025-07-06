import { getBookingById } from "@/api/modules/booking";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image, ScrollView, RefreshControl } from "react-native";

export const CookingCartScreen = ({ ...props }) => {
    const { pagerRef, loading, restaurant, t, bookingId } = props;

    const onLoad = async () => {
        const booking = await getBookingById(bookingId);
        console.log(booking);
    }

    useEffect(() => {
        if (bookingId) onLoad();
    }, [bookingId]);

    return (
        <ScrollView
            contentContainerStyle={styles.flex1BgGray50}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onLoad} />}
        >
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => router.replace("/(home)")}
                >
                    <AntDesign name="home" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t("app.cart")}</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressTextGray}>{t("app.menu")}</Text>
                    <Text style={styles.progressTextActive}>{t("app.cart")}</Text>
                    <Text style={styles.progressTextInactive}>{t("app.payment")}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarActive} />
                    <View style={[styles.progressBarActive, styles.progressBarSpacing]} />
                    <View style={styles.progressBarInactive} />
                </View>
            </View>

            {/* Empty State */}
            <View style={styles.emptyStateContainer}>
                {
                    loading ?
                        <View style={styles.emptyStateImage} />
                        :
                        <Image source={{ uri: restaurant?.imageUrl }} style={styles.emptyStateImage} />
                }
                <Text style={styles.emptyStateTitle}>
                    {t("app.delicious_food_shipping_now")}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                    {t("app.please_wait")}
                </Text>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    flex1BgGray50: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    headerContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerSpacer: {
        width: 24,
    },

    // Progress
    progressContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    progressTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressTextGray: {
        fontSize: 14,
        color: '#6B7280',
    },
    progressTextActive: {
        fontSize: 14,
        fontWeight: '500',
    },
    progressTextInactive: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    progressBarContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    progressBarActive: {
        flex: 1,
        height: 4,
        backgroundColor: '#F97316',
        borderRadius: 2,
    },
    progressBarSpacing: {
        marginHorizontal: 4,
    },
    progressBarInactive: {
        flex: 1,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
    },

    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    emptyStateImage: {
        width: 128,
        height: 128,
        backgroundColor: '#D1D5DB',
        borderRadius: 4,
        marginBottom: 24,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F97316',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        color: '#6B7280',
        textAlign: 'center',
    },
})