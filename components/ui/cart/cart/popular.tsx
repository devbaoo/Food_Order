import { getAllFoodsByRestaurantId } from "@/api/modules/food"
import { Cart, Food } from "@/types"
import { formatCurrency } from "@/utils/currency"
import screen from "@/utils/screen"
import { AntDesign } from "@expo/vector-icons"
import { TFunction } from "i18next"
import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native"

export const Popular = ({ t, cart }: { t: TFunction<"translation", undefined>, cart: Cart | null }) => {
    const [foods, setFoods] = useState<Food[]>([]);

    const onLoad = async () => {
        const foods = await getAllFoodsByRestaurantId(cart?.restaurantId ?? "");
        setFoods(foods.filter(food =>
            !cart?.cartItems.some(item => item.foodId === food.id)
        ));
    }

    useEffect(() => {
        if (cart?.restaurantId) onLoad();
    }, [cart?.restaurantId]);

    return (
        <View style={styles.billContainer}>
            <Text style={styles.billTitle}>{t("app.popular")}</Text>
            <Text style={styles.billSubtitle}>{t("app.other_customer")}</Text>

            {
                foods.length > 0 ?
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.addonsContainer}
                    >
                        {
                            foods.map((item, index) => (
                                <View style={styles.addonItem}>
                                    <View style={{ position: 'relative' }}>
                                        <Image source={{ uri: item.imageUrl }} style={styles.addonImage} />
                                        <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 5, backgroundColor: 'white', borderRadius: screen.width, padding: 5 }}>
                                            <AntDesign name='plus' />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.addonPrice}>{formatCurrency(item.basePrice)}</Text>
                                    <Text style={styles.addonName}>{item.name}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
                    :
                    <View style={{ paddingTop: 20, paddingBottom: 40 }}>
                        <Text style={{ color: "#ccc", fontStyle: 'italic', textAlign: 'center' }}>Empty</Text>
                    </View>
            }
            <View style={styles.billSummary}>
                <View style={styles.billRow}>
                    <Text style={styles.billRowTitle}>{t("app.total")}</Text>
                    <Text style={styles.billRowPriceOrange}>{formatCurrency(cart?.totalPrice ?? 0)}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billRowSubtitle}>{t("app.view_detail")}</Text>
                    <Text style={styles.billRowPrice}>{formatCurrency(cart?.totalPrice ?? 0)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    billContainer: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
    },
    billTitle: {
        fontWeight: '500',
        marginBottom: 5,
    },
    billSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
    },
    addonsContainer: {
        marginBottom: 16,
        gap: 10
    },
    addonItem: {

    },
    addonImage: {
        width: screen.width * 0.3,
        height: screen.width * 0.3,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    addonPrice: {
        fontSize: 12,
    },
    addonName: {
        fontSize: 12,
        color: '#6B7280',
    },
    billSummary: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billRowTitle: {
        fontWeight: '500',
    },
    billRowPriceOrange: {
        color: '#F97316',
        fontWeight: '500',
    },
    billRowSubtitle: {
        color: '#6B7280',
    },
    billRowPrice: {
        fontWeight: '500',
    },

})