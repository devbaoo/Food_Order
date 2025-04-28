import { getUserRecommendations } from "@/api/modules/hint";
import assets from "@/assets";
import BackgroundLoading from "@/components/loading/background";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { Category, Question } from "@/types";
import screen from "@/utils/screen";
import { toast } from "@/utils/toast";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default function SelectionScreen() {
    const stageOneOpacity = useRef(new Animated.Value(0)).current;
    const [screenIndex, setScreenIndex] = useState(0);
    const [selections, setSelections] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const { user } = useAuth();

    const params = useLocalSearchParams();

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

    useEffect(() => {
        if (!params || !params.questions || !params.gender) {
            toast.info("An error occured!", "Check again your server!");
            router.back();
            return;
        }

        setQuestions(JSON.parse(params.questions as string));
    }, [params?.questions]);

    const onSelectOption = (option: string) => {

        if (selections.length === questions.length - 1) {
            setSelections(prev => {
                const newSelections = [...prev.slice(0, screenIndex), option];
                return [params.gender as string, ...newSelections];
            });
            setLoading(true);
            return;
        }

        // Push current answer
        const nextIndex = screenIndex + 1;
        setSelections(prev => [...prev.slice(0, screenIndex), option]);

        // Fade out → change screen → fade in
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
            // Back to previous screen and remove the current answer
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
        const fetchAndNavigate = async () => {
            if (loading && user) {
                const result: string[] = await getUserRecommendations(user.uid, selections);
                setTimeout(() => router.push({
                    pathname: '/(hint)/result',
                    params: {
                        data: JSON.stringify(result)
                    }
                }), 1000);
            }
        };
    
        fetchAndNavigate();
    }, [loading, user]);

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
                                <Text style={styles.questionText}>{questions[screenIndex]?.text}</Text>
                            </View>
                            {questions.length > 0 && questions[screenIndex].options.map(option => (
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