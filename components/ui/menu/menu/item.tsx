import assets from "@/assets";
import Icon from "@/components/icon";
import { Cart, CartItem, Food } from "@/types";
import screen from "@/utils/screen";
import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

interface MenuItemProps {
    item: Food;
    onAdd: () => void;
    onRemove: () => void;
    cart: Cart | null;
}

const MenuItem: React.FC<MenuItemProps> = ({ ...props }) => {
    const { item, onAdd, onRemove, cart } = props;

    return (
        <View style={styles.menuItem}>
            <Image
                source={{ uri: item.image }}
                style={styles.foodImage}
            />
            <View style={{ flex: 1, paddingTop: 15, paddingBottom: 10, paddingRight: 10 }}>
                <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>${item.price}</Text>
                </View>
                <View
                    style={[
                        styles.addButton,
                        cart?.cartItems.some((x: CartItem) => x.foodId === item.id) ? {
                            paddingHorizontal: 15,
                            paddingBlock: 8,
                        } : {
                            padding: 8
                        }
                    ]}
                >
                    {cart && cart.cartItems.some((x: CartItem) => x.foodId === item.id) && (
                        <>
                            <TouchableOpacity onPress={onRemove}>
                                <Icon icon={assets.icon.trash} size={16} />
                            </TouchableOpacity>
                            <Text>{cart?.cartItems.find((x: CartItem) => x.foodId === item.id)?.quantity ?? 1}</Text>
                        </>
                    )}
                    <TouchableOpacity onPress={onAdd}>
                        <Icon icon={assets.icon.plus} size={16} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        marginVertical: 1,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f6f6f6',
        borderRadius: 10
    },
    foodImage: {
        width: screen.width / 3.77,
        height: screen.width / 3.77,
        borderRadius: 5,
    },
    menuItemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    menuItemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    menuItemPrice: {
        fontSize: 14,
        marginTop: 5,
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: 8,
        borderWidth: 1,
        borderColor: '#f6f6f6',
        borderRadius: screen.width,
    },
})