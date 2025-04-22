import { getAllMealTimes } from "@/api/modules/mealTime";
import { getAllRestaurants } from "@/api/modules/restaurant";
import assets from "@/assets";
import Icon from "@/components/icon";
import BackgroundLoading from "@/components/loading/background";
import Modal from "@/components/modal";
import MenuCategory from "@/components/ui/home/menu/category";
import MenuStore from "@/components/ui/home/menu/store";
import { MealTime, Restaurant } from "@/types";
import screen from "@/utils/screen";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView, ImageBackground, RefreshControl } from "react-native";

export default function MenuScreen() {
    const [show, setShow] = useState<boolean>(false);
    const [secondShow, setSecondShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [mealTimes, setMealTimes] = useState<MealTime[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const reset = () => {
        setShow(false);
        setSecondShow(false);
        setLoading(false);
        setSelectedTime(null);
        setSelectedCategory(null);
    }

    const onLoadData = async () => {
        try {
            setLoading(true);
            const [restaurants, mealTimes] = await Promise.all([
                getAllRestaurants(),
                getAllMealTimes()
            ]);

            setRestaurants(restaurants);
            setMealTimes(mealTimes);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoadData();
    }, []);

    return (
        <View style={{ flex: 1, paddingTop: 32 }}>
            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1 }}
            >
                <View style={styles.content}>
                    {/* Header with gradient background */}
                    <TouchableOpacity onPress={() => router.push('/(hint)')}>
                        <ImageBackground
                            source={assets.background.background1}
                            style={{
                                alignSelf: 'flex-start',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 30,
                                paddingBlock: 20
                            }}
                        >
                            <Text style={styles.headerText}>Al's custom Meals</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Time-based meal categories */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        {
                            mealTimes.map((item, index) => (
                                <MealTimeCard
                                    title={item.name}
                                    image={{ uri: item.image }}
                                    onPress={() => {
                                        setSelectedTime(item.id);
                                        setShow(true);
                                    }}
                                    key={index.toString()}
                                />
                            ))
                        }
                    </View>

                    {/* Restaurants section */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={false} onRefresh={onLoadData} />
                        }
                    >
                        {
                            restaurants.map((item, index) => (
                                <RestaurantCard
                                    name={item.name}
                                    image={{ uri: item.image }}
                                    rating={item.rating}
                                    key={index.toString()}
                                />
                            ))
                        }
                    </ScrollView>
                </View>
            </LinearGradient>

            <Modal
                visible={show}
                containerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                wrapperStyle={{ flex: 0 }}
                onCancel={reset}
            >
                <MenuCategory
                    selectedTime={selectedTime}
                    onPress={(value) => {
                        setSelectedCategory(value);
                        setSecondShow(true);
                    }}
                />
            </Modal>

            <Modal
                visible={secondShow}
                containerStyle={{ paddingBlock: screen.width * 0.08 }}
                onCancel={reset}
            >
                <LinearGradient
                    colors={['#00696C', '#00CBD2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        flex: 1,
                    }}
                >
                    <MenuStore
                        onClose={reset}
                        selectedCategory={selectedCategory}
                        selectedTime={selectedTime}
                        onSelect={setSelectedCategory}
                    />
                </LinearGradient>
            </Modal>

            {loading && <BackgroundLoading />}
        </View >
    )
}

const MealTimeCard = ({ title, image, onPress }: { title: string, image: any, onPress?: () => void }) => (
    <TouchableOpacity style={styles.mealTimeCard} onPress={onPress}>
        <Image source={image} style={styles.mealTimeImage} />
        <Text style={styles.mealTimeTitle}>{title}</Text>
        <View style={styles.chevronContainer}>
            <Icon icon={assets.icon.dropdown} size={24} />
        </View>
    </TouchableOpacity>
);

const RestaurantCard = ({ name, image, rating }: { name: string, image: any, rating: number }) => (
    <TouchableOpacity style={styles.restaurantCard}>
        <Image source={image} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{name}</Text>
            <View style={styles.ratingContainer}>
                {Array(5).fill(null).map((_, i) => (
                    <Text key={i} style={i < rating ? styles.starFilled : styles.starEmpty}>★</Text>
                ))}
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 15,
        gap: 15
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    mealTimeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        flex: 1,
        overflow: 'hidden',
        alignItems: 'center',
        padding: 5,
        marginBottom: 10
    },
    mealTimeImage: {
        width: '100%',
        height: 147,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderRadius: 10
    },
    mealTimeTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        width: '100%',
        paddingHorizontal: 12
    },
    chevronContainer: {
        width: '100%',
        paddingHorizontal: 13
    },
    chevron: {
        fontSize: 14,
        color: '#555',
    },
    restaurantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        padding: 5
    },
    restaurantImage: {
        width: '100%',
        height: 150,
        borderRadius: 10
    },
    restaurantInfo: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    starFilled: {
        color: '#FFD700',
        fontSize: 18,
    },
    starEmpty: {
        color: '#E0E0E0',
        fontSize: 18,
    },
});