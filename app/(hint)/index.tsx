import assets from "@/assets";
import screen from "@/utils/screen";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"

export default () => {
    const bubbleOpacity = useRef(new Animated.Value(1)).current;
    const logoTranslateY = useRef(new Animated.Value(0)).current;
    const logoTranslateX = useRef(new Animated.Value(15)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const stageOneOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Giai đoạn 1: xuất hiện hình 1 sau 500ms
        setTimeout(() => {
            Animated.timing(stageOneOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }, 500);

        // Giai đoạn 2: sau khi hình 1 hiện xong thì animate tiếp
        setTimeout(() => {
            Animated.sequence([
                Animated.timing(bubbleOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.parallel([
                    Animated.timing(logoTranslateY, {
                        toValue: -120,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(logoTranslateX, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(buttonOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 500 + 600 + 300); // đợi hết fade in hình 1 rồi mới chạy hình 2
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    flex: 1,
                }}
            >
                <Animated.View style={{
                    flex: 1,
                    opacity: stageOneOpacity,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/* Bubble speech */}
                    <Animated.View style={[styles.bubble, { opacity: bubbleOpacity }]}>
                        <Text style={styles.bubbleText}>Let me help with your choice...</Text>
                    </Animated.View>

                    {/* Logo */}
                    <Animated.Image
                        source={assets.logo} // thay bằng ảnh của bạn
                        style={[styles.logo, {
                            transform: [
                                { translateY: logoTranslateY },
                                { translateX: logoTranslateX }
                            ]
                        }]}
                        resizeMode="contain"
                    />

                    {/* Button */}
                    <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity }]}>
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/(hint)/gender')}>
                            <Text style={styles.buttonText}>START</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },

    bubble: {
        backgroundColor: '#35A3A6',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 100,
        marginBottom: 20,
        alignSelf: 'flex-start',
        marginLeft: 20
    },
    bubbleText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'semibold',
        maxWidth: '70%'
    },
    logo: {
        height: screen.height / 7.7,
        resizeMode: 'contain',
    },
    buttonWrapper: {
        marginTop: 5,
        position: 'absolute',
        top: screen.height / 2,
        width: '100%',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#35A3A6',
        paddingVertical: 20,
        width: '70%',
        borderRadius: 100,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center'
    },
});