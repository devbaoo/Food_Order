import assets from "@/assets"
import screen from "@/utils/screen"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"

export default function GenderScreen() {
    const [selected, setSelected] = useState<'man' | 'woman' | null>(null);

    const scaleWoman = useRef(new Animated.Value(1)).current;
    const scaleMan = useRef(new Animated.Value(1)).current;

    const translateXWoman = useRef(new Animated.Value(0)).current;
    const translateXMan = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const onSelect = (gender: 'man' | 'woman') => {
        setSelected(gender);

        const isWoman = gender === 'woman';

        Animated.parallel([
            Animated.timing(isWoman ? scaleWoman : scaleMan, {
                toValue: 1.6,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(isWoman ? translateXWoman : translateXMan, {
                toValue: isWoman ? screen.width / 8 : -screen.width / 8,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        
        setTimeout(() => router.push('/(hint)/selection'), 1500);
    };

    const reset = () => {
        setSelected(null);
        Animated.parallel([
            Animated.timing(scaleWoman, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(scaleMan, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateXWoman, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateXMan, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <TouchableWithoutFeedback onPress={reset}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#00696C', '#00CBD2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Animated.View style={[StyleSheet.absoluteFillObject, {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        opacity: overlayOpacity,
                        zIndex: selected ? 1 : 0, // nằm dưới các nút
                    }]} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                        {/* Woman */}
                        <Animated.View style={{
                            transform: [
                                { scale: scaleWoman },
                                { translateX: translateXWoman }
                            ],
                            zIndex: selected === 'woman' ? 10 : 0,
                        }}>
                            <TouchableOpacity onPress={() => onSelect('woman')} activeOpacity={0.8} style={styles.button}>
                                <Image source={assets.gender.woman} style={styles.image} />
                                <Text style={styles.text}>Woman</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Man */}
                        <Animated.View style={{
                            transform: [
                                { scale: scaleMan },
                                { translateX: translateXMan }
                            ],
                            zIndex: selected === 'man' ? 10 : 0,
                        }}>
                            <TouchableOpacity onPress={() => onSelect('man')} activeOpacity={0.8} style={styles.button}>
                                <Image source={assets.gender.man} style={styles.image} />
                                <Text style={styles.text}>Man</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </LinearGradient>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: screen.width / 3,
        height: screen.width / 3,
    },

    text: {
        fontSize: 20,
        color: '#FF96D4'
    }
})