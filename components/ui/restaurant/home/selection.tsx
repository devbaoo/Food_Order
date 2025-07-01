import { getAllFoodsByRestaurantIdAndCategory } from "@/api/modules/food";
import BackgroundLoading2 from "@/components/loading/background_2";
import { Food } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { TFunction } from "i18next";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Image } from "react-native";

const MenuSelection = ({
    selectedCategory,
    restaurantId,
    onItemClicked,
    t
}: {
    selectedCategory: { id: string, name: string },
    restaurantId: string,
    onItemClicked: (food: Food) => void,
    t: TFunction<"translation", undefined>
}) => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(false);

    const onLoad = async () => {
        setLoading(true);
        setFoods([]);
        const foods = await getAllFoodsByRestaurantIdAndCategory(restaurantId, selectedCategory.id);

        setTimeout(() => {
            setFoods(foods);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (selectedCategory && restaurantId) {
            onLoad();
        }
    }, [restaurantId, selectedCategory]);

    return (
        <ScrollView
            style={styles.menuSection}
            refreshControl={
                <RefreshControl onRefresh={onLoad} refreshing={false} />
            }
        >
            <Text style={styles.sectionTitle}>{selectedCategory.name}</Text>

            {foods.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                    <View style={styles.menuItemInfo}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.originalPrice}>{t("app.from")} {item.basePrice}</Text>
                            <Text style={styles.discountedPrice}>{item.basePrice}</Text>
                        </View>
                        <Text style={styles.menuItemDescription}>{item.description}</Text>
                    </View>
                    <View style={styles.menuItemImageContainer}>
                        <Image source={{ uri: item.imageUrl }} style={styles.menuItemImage} />
                        <TouchableOpacity style={styles.addButton} onPress={() => onItemClicked(item)}>
                            <Ionicons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {loading && <BackgroundLoading2 />}
        </ScrollView>
    )
}

export default MenuSelection;

const styles = StyleSheet.create({
    menuSection: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemInfo: {
        flex: 1,
        paddingRight: 16,
    },
    menuItemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    discountedPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF6B35',
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    menuItemImageContainer: {
        position: 'relative',
    },
    menuItemImage: {
        width: 80,
        height: 80,
        backgroundColor: '#9CA3AF',
        borderRadius: 15,
    },
    addButton: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        width: 32,
        height: 32,
        backgroundColor: '#FF6B35',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
})