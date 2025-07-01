import { updateBookingStatus } from "@/api/modules/booking";
import assets from "@/assets";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity, View, Text } from "react-native";

export const DeliveryMapScreen = ({ ...props }) => {
    const { pagerRef, currentPage, info, bookingId, t } = props;

    useEffect(() => {
        if (currentPage === 2) {
            setTimeout(async () => await updateStatus(), 4000);
        }
    }, [currentPage]);

    const updateStatus = async () => {
        await updateBookingStatus(bookingId, "Delivered");
        pagerRef.current?.setPage(3);
    }

    return (
        <ImageBackground source={assets.background.background2} style={styles.flex1}>
            {/* Header */}
            <View style={styles.mapHeader}>
                <TouchableOpacity
                    onPress={() => pagerRef.current?.setPage(0)}
                >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="my-location" size={24} color="blue" />
                </TouchableOpacity>
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
            </View>

            {/* Bottom Info */}
            <View style={styles.deliveryInfo}>
                <View style={styles.deliveryInfoRow}>
                    <MaterialIcons name="schedule" size={20} color="orange" />
                    <Text style={styles.deliveryInfoText}>20-30 {t("app.minutes")}</Text>
                </View>
                <View style={styles.deliveryInfoRow}>
                    <MaterialIcons name="location-pin" size={20} color="orange" />
                    <Text style={styles.deliveryInfoAddress}>{info?.address}</Text>
                </View>

                <View style={styles.driverInfo}>
                    <View style={styles.driverInfoLeft}>
                        <View style={styles.driverAvatar} />
                        <View>
                            <Text style={styles.driverName}>Thông</Text>
                            <Text style={styles.driverStatus}>{t("app.calling_normally")}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => pagerRef.current?.setPage(3)}
                    >
                        <MaterialIcons name="phone" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },

    mapHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },

    deliveryInfo: {
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        marginBottom: 40
    },
    deliveryInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    deliveryInfoText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    deliveryInfoAddress: {
        marginLeft: 8,
        color: '#6B7280',
    },
    driverInfo: {
        backgroundColor: '#DBEAFE',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    driverInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatar: {
        width: 32,
        height: 32,
        backgroundColor: '#60A5FA',
        borderRadius: 16,
        marginRight: 12,
    },
    driverName: {
        fontWeight: '500',
    },
    driverStatus: {
        color: '#6B7280',
    },
    continueButtonDelivery: {
        backgroundColor: '#F97316',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
})