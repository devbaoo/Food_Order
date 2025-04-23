import { getAllFoodsByPrice } from "@/api/modules/food";
import assets from "@/assets";
import Icon from "@/components/icon";
import { Cart, Food } from "@/types";
import screen from "@/utils/screen";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

interface CartRecommendItemProps {
    value: number;
    cart: Cart | null;
    onAdd: (item: Food) => void;
    onRemove: (item: Food) => void;
}

const CartRecommendItem: React.FC<CartRecommendItemProps> = ({ ...props }) => {
    const { value, cart, onAdd, onRemove } = props;
    const [foods, setFoods] = useState<Food[]>([]);

    const onLoad = async () => {
        try {
            const minPrice = Math.max(value - (cart?.totalPrice ?? 0), 0);
            const foods = await getAllFoodsByPrice(minPrice);
            setFoods(foods);
        }
        finally {

        }
    }

    useEffect(() => {
        onLoad();
    }, [value, cart]);

    return (
        <View style={styles.recommendedSection}>
            <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedTitle}>Recommended for you</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
            >
                {foods && foods.length > 0 && foods.map((item, index) => (
                    <View style={styles.recommendedItem} key={index.toString()}>
                        <View style={{ width: screen.width / 2.6875, height: screen.height / 6.38, borderRadius: 10, backgroundColor: '#F6F6F6', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={item ? { uri: item.image } : assets.food.nuoccam}
                                style={styles.recommendedImage}
                            />
                            <View style={styles.addButtonContainer}>
                                {
                                    (cart?.cartItems.find(x => x.foodId === item.id)?.quantity ?? 0) > 0 && (
                                        <>
                                            <TouchableOpacity style={styles.addButton} onPress={() => onRemove(item)}>
                                                <Icon icon={assets.icon.trash} size={18} />
                                            </TouchableOpacity>
                                            <Text>{cart?.cartItems.find(x => x.foodId === item.id)?.quantity ?? 0}</Text>
                                        </>
                                    )
                                }
                                <TouchableOpacity style={styles.addButton} onPress={() => onAdd(item)}>
                                    <Icon icon={assets.icon.plus} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.recommendedDetails}>
                            <Text style={styles.recommendedName}>{item.name}</Text>
                            <View style={styles.ratingContainer}>
                                <AntDesign name="star" size={14} color="#FFD700" />
                                <Text style={styles.ratingText}>4.8 (287)</Text>
                            </View>
                            <Text style={styles.recommendedPrice}>${item.price}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default CartRecommendItem;

const styles = StyleSheet.create({
    recommendedSection: {
        marginBottom: 20,
    },
    recommendedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    recommendedTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    seeAllText: {
        fontSize: 14,
        color: '#00BCD4',
    },
    recommendedItem: {
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6
    },
    recommendedImage: {
        width: screen.width / 3.467,
        height: screen.height / 6.38,
    },
    recommendedDetails: {
        flex: 1,
        paddingHorizontal: 12,
    },
    recommendedName: {
        fontSize: 16,
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    ratingText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    recommendedPrice: {
        fontSize: 15,
        fontWeight: '500',
    },
    addButtonContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        bottom: 5,
        right: 5,
        borderRadius: screen.width,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    addButton: {

    },
})