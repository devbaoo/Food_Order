import { useTypewriter } from "@/hooks/useTypeWriter";
import { Cart } from "@/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface CartDeliveryProgressProps {
    value: number;
    cart: Cart | null;
}

const CartDeliveryProgress: React.FC<CartDeliveryProgressProps> = ({ value, cart }) => {
    const [distance, setDistance] = useState<number>(0);
    const typewriterText = useTypewriter("Yaay! You've got free delivery..");
    const progress = useSharedValue(0);
    const [barWidth, setBarWidth] = useState(0);

    useEffect(() => {
        setDistance(Math.max(value - (cart?.totalPrice ?? 0), 0));
    }, [cart, value]);

    useEffect(() => {
        if (cart) {
            const percent = Math.min((cart?.totalPrice / value) * 100, 100);
            progress.value = withTiming(percent, { duration: 500 });
        }
    }, [cart?.totalPrice, value, progress]);

    const animatedBarStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
            backgroundColor: '#00BCD4',
            height: 6,
            borderRadius: 3,
        };
    });

    const displayText =
        distance <= 0
            ? typewriterText
            : `You are $${distance.toFixed(2)} away from free delivery`;

    return (
        <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>
                {displayText}
            </Text>
            <View 
                style={styles.progressBarContainer}
                onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
            >
                <Animated.View style={animatedBarStyle} />
            </View>
        </View>
    );
};

export default CartDeliveryProgress;

const styles = StyleSheet.create({
    deliveryInfo: {
        marginVertical: 20,
        marginBottom: 40
    },
    deliveryText: {
        fontSize: 15,
        marginBottom: 15,
        textAlign: 'center'
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        overflow: 'hidden',
        width: '100%'
    }
});