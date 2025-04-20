import assets from "@/assets";
import Icon from "@/components/icon";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

interface CartItemProps {
    increaseQuantity: () => void;
    quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ ...props }) => {
    const { increaseQuantity, quantity } = props;

    return (
        <View style={styles.cartItem}>
            <Image
                source={assets.food.pho}
                style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>Pho Hanoi</Text>
                <Text style={styles.itemPrice}>$3.45</Text>
            </View>
            <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => { }}>
                    <Icon icon={assets.icon.trash} size={18} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={increaseQuantity}>
                    <Icon icon={assets.icon.plus} size={18} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CartItem;

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.03)',
        borderRadius: 10
    },
    itemImage: {
        width: 114,
        height: 114,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        paddingHorizontal: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
    },
    quantityControl: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
        width: 100,
        justifyContent: 'space-between',
        marginBottom: 20,
        marginRight: 20,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.08)',
        paddingBlock: 8,
        paddingHorizontal: 16
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
    },
})