import assets from "@/assets";
import Icon from "@/components/icon";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const CheckoutCounpon = () => {
    return (
        <TouchableOpacity style={[styles.addNoteButton, { borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }]}>
            <Icon icon={assets.icon.counpon} size={24} />
            <Text style={{ fontSize: 16, flex: 1 }}>Apply Coupon</Text>
            <Icon icon={assets.icon.chevron_right} size={16} />
        </TouchableOpacity>
    )
}

export default CheckoutCounpon;

const styles = StyleSheet.create({
    addNoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 15
    },
})