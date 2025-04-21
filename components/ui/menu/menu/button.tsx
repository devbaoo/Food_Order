import assets from "@/assets";
import Icon from "@/components/icon";
import screen from "@/utils/screen";
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

interface MenuItem {
    id: number,
    name: string,
    price: string
}

type SelectedItem = MenuItem & { quantity: number };

interface MenuAddToCartButtonProps {
    selectedItems: SelectedItem[];
}

const MenuAddToCartButton: React.FC<MenuAddToCartButtonProps> = ({...props}) => {
    const {selectedItems} = props;

    return (
        <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to cart</Text>
            <View style={styles.cartIcon}>
                <Icon icon={assets.icon.cart_white} size={16} />
                {
                    selectedItems.length > 0 && (
                        <View style={{ top: -8, right: -12, position: 'absolute' }}>
                            <View style={styles.quantityWrapper}>
                                <Text style={{ fontSize: 12.4, color: 'white' }}>{selectedItems.length}</Text>
                            </View>
                        </View>
                    )
                }
            </View>
        </TouchableOpacity >
    )
}

export default MenuAddToCartButton;

const styles = StyleSheet.create({
    addToCartButton: {
        backgroundColor: '#008080',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 8,
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cartIcon: {
        marginLeft: 10,
        position: 'relative'
    },

    quantityWrapper: {
        backgroundColor: '#FF0019',
        borderRadius: screen.width,
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18
    }
})