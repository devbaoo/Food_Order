import assets from "@/assets"
import Icon from "@/components/icon"
import { router } from "expo-router"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

const CheckoutHeader = () => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Icon icon={assets.icon.chevron_left} size={16} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={{ width: 6 }} />
        </View>
    )
}

export default CheckoutHeader;

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