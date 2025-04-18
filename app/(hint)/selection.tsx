import assets from "@/assets";
import BackgroundLoading from "@/components/loading/background";
import screen from "@/utils/screen";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default function SelectionScreen() {
    const stageOneOpacity = useRef(new Animated.Value(0)).current;
    const [screenIndex, setScreenIndex] = useState(0);
    const [selections, setSelections] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(stageOneOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }, 500);
    }, []);

    const screens = [
        {
            question: 'Do you follow a vegetarian or vegan or normal diet?',
            options: ['Vegetarian', 'Vegan', 'Normal'],
        },
        {
            question: 'Do you have any food allergies',
            options: ['Seafood', 'Peanut', 'Dairy', 'Red meat', 'Others'],
        },
        {
            question: 'What kind of flavors do you like?',
            options: ['Sweet', 'Sour', 'Salty', 'Spicy', 'Rich']
        },
        {
            question: 'Do you prefer dishes from a specific cuisine?',
            options: ['Vietnamese', 'Japanese', 'Korean', 'Italian', 'Chinese']
        }
    ];

    const onSelectOption = (option: string) => {

        if (selections.length === screens.length - 1) {
            setSelections(prev => [...prev.slice(0, screenIndex), option]);
            setLoading(true);
            return;
        }

        // Thêm câu trả lời hiện tại
        const nextIndex = screenIndex + 1;
        setSelections(prev => [...prev.slice(0, screenIndex), option]);

        // Fade out → chuyển màn hình → fade in
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setScreenIndex(nextIndex);
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const onGoBack = () => {
        if (screenIndex === 0) {
            router.back();
            return;
        }

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // Quay lại màn trước và xóa câu trả lời hiện tại
            setScreenIndex(prev => prev - 1);
            setSelections(prev => prev.slice(0, prev.length - 1));
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    useEffect(() => {
        if (loading) {
            setTimeout(() => router.push('/(hint)/result'), 1000);
        }
    }, [loading]);

    return (
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
                <Animated.View style={{
                    flex: 1,
                    opacity: stageOneOpacity,
                    paddingTop: 32,
                    width: '100%',
                    paddingHorizontal: 10
                }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        <TouchableOpacity onPress={onGoBack}>
                            <Image source={assets.icon.back} style={{ width: 24, height: 16, alignSelf: 'flex-start' }} resizeMode="contain" />
                        </TouchableOpacity>
                        <Image source={assets.logo} style={{ height: screen.height / 7.7, alignSelf: 'center' }} resizeMode="contain" />
                        <Animated.View style={{ opacity: fadeAnim, paddingBlock: 30, gap: 15 }}>
                            <View style={styles.questionTextContainer}>
                                <Text style={styles.questionText}>{screens[screenIndex].question}</Text>
                            </View>
                            {screens[screenIndex].options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => onSelectOption(option)}
                                    style={styles.optionButton}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </Animated.View>
                    </View>
                </Animated.View>
            </LinearGradient>

            {loading && <BackgroundLoading />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },

    questionTextContainer: {
        width: '100%',
        paddingBlock: 20,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CBD2',
        borderRadius: 10
    },

    questionText: {
        fontSize: 16,
        color: '#005457'
    },

    optionButton: {
        width: '100%',
        paddingBlock: 15,
        backgroundColor: '#00696C',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    optionText: {
        color: 'white',
        fontSize: 32
    }
});