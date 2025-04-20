import assets from "@/assets"
import Icon from "@/components/icon"
import { router } from "expo-router"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

const CartHeader = () => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Icon icon={assets.icon.chevron_left} size={16} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon icon={assets.icon.order} width={16} height={17.62} />
                <Text style={styles.ordersText}>Orders</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CartHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    ordersText: {
        fontSize: 16,
    },
})