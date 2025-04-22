import assets from "@/assets"
import screen from "@/utils/screen"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text } from "react-native"

const BackgroundLoading = () => {
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount(prev => (prev % 3) + 1); // 1 → 2 → 3 → 1
        }, 500); // 500ms per time

        return () => clearInterval(interval); // cleanup
    }, []);

    return (
        <LinearGradient
            colors={['#00696C', '#00CBD2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 15
            }, StyleSheet.absoluteFillObject]}
        >
            <Image source={assets.logo} style={{ height: screen.height / 7.7 }} resizeMode="contain" />
            <Text style={{ fontSize: 36, color: '#005457' }}>LOADING{'.'.repeat(dotCount)}</Text>
        </LinearGradient>
    )
}

export default BackgroundLoading;