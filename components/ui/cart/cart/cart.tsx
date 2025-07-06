import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, Image, StyleSheet, Animated, Alert } from "react-native";
import CartItem from "./item";
import { router } from "expo-router";
import { Popular } from "./popular";
import { toast } from "@/utils/toast";

export const CartScreen = ({ ...props }) => {
    const { onLoad, cart, info, pagerRef, loading, restaurant, currentStep, setCurrentStep, t } = props;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let progress = 0;
        if (currentStep === 1) progress = 0.5;
        else if (currentStep === 2) progress = 1;

        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentStep]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    // Function to handle step progression
    const handleNextStep = () => {
        if (!info?.address || info?.address === "") {
            toast.error(t("app.error"), t("app.please_update_your_address"));
            return;
        }

        Alert.alert(
            'Xác nhận đơn hàng',
            `Bạn có chắc chắn muốn giao hàng đến địa chỉ ${info?.address} ${info?.provinceAddress}?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: () => {
                        if (currentStep < 2) {
                            setCurrentStep(currentStep + 1);
                            pagerRef.current?.setPage(1);
                        }
                    },
                },
            ]
        );
    };

    // Function to handle step click (for direct navigation)
    const handleStepClick = (step: number) => {
        setCurrentStep(step);
    };

    return (
        <ScrollView contentContainerStyle={styles.flex1BgGray50} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.replace("/(home)")}>
                    <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t("app.cart")}</Text>
                <TouchableOpacity onPress={onLoad}>
                    <AntDesign name="reload1" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                    <TouchableOpacity onPress={() => handleStepClick(0)}>
                        <Text style={currentStep >= 0 ? styles.progressTextActive : styles.progressTextInactive}>
                            {t("app.cart")}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStepClick(1)}>
                        <Text style={currentStep >= 1 ? styles.progressTextActive : styles.progressTextInactive}>
                            {t("app.payment")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarInactive}>
                        <Animated.View style={[styles.progressBarActive, { width: progressWidth }]} />
                    </View>
                </View>
            </View>

            {/* Restaurant Info */}
            <View style={styles.restaurantInfoContainer}>
                <View style={styles.restaurantRow}>
                    {
                        loading ?
                            <View style={styles.restaurantImage} />
                            :
                            <Image source={{ uri: restaurant?.imageUrl }} style={styles.restaurantImage} />
                    }
                    <View style={styles.restaurantDetails}>
                        <Text style={styles.restaurantName}>{t("app.delivery_time")}</Text>
                        <Text style={styles.deliveryTime}>{t("app.casual")}</Text>
                        <TouchableOpacity>
                            <Text>{t("app.change")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Order Item */}
            {
                cart?.cartItems.map((item: any, index: number) => (
                    <CartItem
                        key={index}
                        item={item}
                        reload={onLoad}
                        info={info}
                        isReloading={loading}
                        t={t}
                    />
                ))
            }

            {/* Add More */}
            <TouchableOpacity style={styles.addMoreContainer} onPress={() => router.push({ pathname: '/(restaurant)', params: { id: restaurant?.id } })}>
                <Text style={styles.addMoreText}>+ {t("app.add_food")}</Text>
            </TouchableOpacity>

            {/* Bill Summary */}
            <Popular t={t} cart={cart} />

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.checkoutButton, currentStep > 0 && styles.checkoutButtonSmall]}
                    onPress={handleNextStep}
                >
                    <Text style={styles.checkoutButtonText}>
                        {t("app.check_order")}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    flex1BgGray50: {
        backgroundColor: '#F9FAFB',
    },

    // Header
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
        paddingVertical: 16,
    },
    progressTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressTextGray: {
        fontSize: 14,
        color: '#6B7280',
    },
    progressTextActive: {
        fontSize: 14,
        fontWeight: '500',
        color: '#F97316',
    },
    progressTextInactive: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    progressBarContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    progressBarInactive: {
        flex: 1,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        position: 'relative',
    },
    progressBarActive: {
        height: 4,
        backgroundColor: '#F97316',
        borderRadius: 2,
        position: 'absolute',
        left: 0,
        top: 0,
    },

    restaurantInfoContainer: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
    },
    restaurantRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    restaurantImage: {
        width: 78,
        height: 78,
        backgroundColor: '#D1D5DB',
        borderRadius: 8,
        marginRight: 12,
    },
    restaurantDetails: {
        flex: 1,
    },
    restaurantName: {
        fontWeight: '500',
    },
    deliveryTime: {
        color: '#F97316',
        fontWeight: '500',
        marginBottom: 15
    },

    addMoreContainer: {
        marginHorizontal: 16,
        marginTop: 8,
        padding: 12,
    },
    addMoreText: {
        color: '#F97316',
        fontWeight: '500',
    },

    // Button container
    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBlock: 16,
        gap: 12,
    },

    // Back button
    backButton: {
        backgroundColor: '#E5E7EB',
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#374151',
        fontWeight: '500',
        fontSize: 16,
    },

    // Checkout button
    checkoutButton: {
        backgroundColor: '#F97316',
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: 0,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 2,
    },
    checkoutButtonSmall: {
        flex: 2,
    },
    checkoutButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },

    // Continue button
    continueButton: {
        backgroundColor: '#F97316',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
})