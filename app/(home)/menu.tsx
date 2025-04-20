import assets from "@/assets";
import Icon from "@/components/icon";
import Modal from "@/components/modal";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView, ImageBackground } from "react-native";

export default function MenuScreen() {
    const [show, setShow] = useState<boolean>(false);
    const [secondShow, setSecondShow] = useState<boolean>(false);

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
                        <MealTimeCard title="Morning" image={assets.food.food1} onPress={() => setShow(true)} />
                        <MealTimeCard title="Noon" image={assets.food.food2} />
                        <MealTimeCard title="Evening" image={assets.food.food3} />
                    </View>

                    {/* Restaurants section */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <RestaurantCard
                            name="Shopname"
                            image={assets.banner.banner1}
                            rating={4}
                        />
                        <RestaurantCard
                            name="Shopname"
                            image={assets.banner.banner2}
                            rating={5}
                        />
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
                onCancel={() => setShow(false)}
            >
                <View style={{ padding: 16, backgroundColor: "white", borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15 }}>
                    <TouchableOpacity style={{ gap: 5 }} onPress={() => {
                        setSecondShow(true);
                        setShow(false);
                    }}>
                        <Image source={assets.food.food1} style={{ width: 110, height: 147 }} />
                        <Text>Dish1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ gap: 5 }}>
                        <Image source={assets.food.food1} style={{ width: 110, height: 147 }} />
                        <Text>Dish2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ gap: 5 }}>
                        <Image source={assets.food.food1} style={{ width: 110, height: 147 }} />
                        <Text>Dish2</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                visible={secondShow}
                containerStyle={{ paddingBlock: 20 }}
                onCancel={() => setSecondShow(false)}
            >
                <LinearGradient
                    colors={['#00696C', '#00CBD2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        flex: 1,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15, paddingTop: 20 }}>
                        <TouchableOpacity style={{ gap: 5, backgroundColor: 'white', padding: 5, borderRadius: 10 }} onPress={() => setSecondShow(false)}>
                            <Image source={assets.food.food1} style={{ width: 110, height: 147 }} />
                            <Text>Dish1</Text>
                            <Icon icon={assets.icon.dropdown} size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ gap: 5, backgroundColor: 'white', padding: 5, borderRadius: 10 }}>
                            <Image source={assets.food.food1} style={{ width: 110, height: 147 }} />
                            <Text>Dish2</Text>
                            <Icon icon={assets.icon.dropdown} size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ gap: 5, backgroundColor: 'white', padding: 5, borderRadius: 10 }}>
                            <Image source={assets.food.food1} style={{ width: 110, height: 147 }} />
                            <Text>Dish2</Text>
                            <Icon icon={assets.icon.dropdown} size={16} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                    >

                    </ScrollView>

                    <TouchableOpacity style={{ paddingBlock: 30, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Icon icon={assets.icon.chevron_left} size={16} />
                    </TouchableOpacity>
                </LinearGradient>
            </Modal>
        </View>
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