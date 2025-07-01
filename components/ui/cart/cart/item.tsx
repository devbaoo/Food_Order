import { updateCartItem } from "@/api/modules/cart";
import { getFoodById } from "@/api/modules/food";
import { CartItem as CartItemType, Food, Info } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { toast } from "@/utils/toast";
import { AntDesign } from "@expo/vector-icons";
import { TFunction } from "i18next";
import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface CartItemProps {
    item: CartItemType | null;
    info: Info | null;
    reload: () => void;
    isReloading: boolean;
    t: TFunction<"translation", undefined>
}

const CartItem: React.FC<CartItemProps> = ({ ...props }) => {
    const { item, info, reload, isReloading, t } = props;
    const [food, setFood] = useState<Food | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const onLoad = async (id: string) => {
        try {
            const food = await getFoodById(id);
            setFood(food);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (item) onLoad(item.foodId);
    }, [item]);

    const updateQuantity = async (value: number) => {
        if (!info || !item) {
            toast.error(t("app.error"), t("app.something_went-wrong"));
            return;
        }
        setIsUpdating(true);
        await updateCartItem(info?.id, item?.foodId, value, food?.basePrice, food?.restaurantId);
        setTimeout(() => {
            setIsUpdating(false);
            reload();
        }, 100);
    }

    return (
        <View style={styles.orderItemContainer}>
            <View style={styles.orderItemRow}>
                <View style={styles.orderItemLeft}>
                    {
                        loading ?
                            <View style={styles.orderItemImage} />
                            :
                            <Image source={{ uri: food?.imageUrl }} style={styles.orderItemImage} />
                    }

                    <View>
                        <Text style={styles.orderItemName}>{food?.name ?? "Loading..."}</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => updateQuantity(-1)}
                                disabled={isUpdating}
                            >
                                <AntDesign name="minus" size={12} color="gray" />
                            </TouchableOpacity>
                            {
                                isUpdating || isReloading ?
                                    <ActivityIndicator size={16} color="red" />
                                    :
                                    <Text>{item?.quantity}</Text>
                            }
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => updateQuantity(1)}
                                disabled={isUpdating}
                            >
                                <AntDesign name="plus" size={12} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={styles.orderItemPrice}>{formatCurrency((item?.quantity ?? 0) * (item?.price ?? 0))}</Text>
            </View>
        </View>
    )
}

export default CartItem;

const styles = StyleSheet.create({
    // Order item
    orderItemContainer: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
    },
    orderItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderItemImage: {
        width: 50,
        height: 50,
        backgroundColor: '#D1D5DB',
        borderRadius: 4,
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center"
    },
    orderItemName: {
        fontWeight: '500',
        marginBottom: 8
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    quantityButton: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderItemPrice: {
        textAlign: 'right',
        color: '#F97316',
        fontWeight: '500',
        marginTop: 8,
    },
})