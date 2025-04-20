import assets from "@/assets";
import Icon from "@/components/icon";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const CheckoutAddress = () => {
    return (
        <TouchableOpacity style={[styles.addNoteButton, { borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }]}>
            <Icon icon={assets.icon.location} size={24} />
            <View style={{ flex: 1, gap: 8 }}>
                <Text style={{ fontSize: 16 }}>S5.03 Vinhomes Grandpark </Text>
                <Text style={{ fontSize: 14 }}>Long Thanh My, Q9, Thu Duc</Text>
            </View>
            <Icon icon={assets.icon.chevron_right} size={16} />
        </TouchableOpacity>
    )
}

export default CheckoutAddress;

const styles = StyleSheet.create({
    addNoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 15
    },
    addNoteText: {
        fontSize: 16,
        flex: 1,
    },
})