import assets from "@/assets";
import Icon from "@/components/icon";
import screen from "@/utils/screen";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { Animated, ImageBackground, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface MenuHeaderProps {
    progress: SharedValue<number>;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ ...props }) => {
    const { progress } = props;

    const bgStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [1, 0]),
        };
    });

    const blurStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [1, 0]),
        };
    });

    const titleStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [1, 0]),
            transform: [
                {
                    translateY: interpolate(progress.value, [0, 1], [0, -10]),
                },
            ],
        };
    });

    const title2Style = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [0, 1]),
            transform: [
                {
                    translateY: interpolate(progress.value, [0, 1], [10, 0]),
                },
            ],
        };
    });

    return (
        <View style={styles.header}>
            <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
                <ImageBackground
                    style={{ flex: 1 }}
                    resizeMode="cover"
                    source={assets.food.banhcanhcua}
                />
            </Animated.View>

            <Animated.View style={[styles.blur, blurStyle]}>
                <BlurView intensity={100} tint="light" style={styles.blur} />
            </Animated.View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Icon icon={assets.icon.chevron_left} size={16} />
                        <View style={{}} />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Animated.Text style={[titleStyle, styles.absText]}>
                            <Text style={styles.headerTitle}>Pho Long Dao</Text>
                        </Animated.Text>
                        <Animated.Text style={[title2Style, styles.absText]}>
                            <Text style={styles.headerTitle}>Options</Text>
                        </Animated.Text>
                    </View>
                    <TouchableOpacity style={styles.ordersButton}>
                        <Icon icon={assets.icon.order} width={16} height={17.62} />
                        <Text style={styles.ordersButtonText}>Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default MenuHeader;

const styles = StyleSheet.create({
    header: {
        overflow: 'hidden',
        width: '100%',
        height: screen.height / 12.85,
        borderRadius: 15
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
    },
    blur: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    titleWrapper: {
        position: 'absolute',
        top: screen.height * 0.015,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    absText: {
        position: 'absolute',
    },
    backButton: {
        padding: 5,
    },
    ordersButton: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    ordersButtonText: {
        fontSize: 16,
    },
})