import assets from "@/assets";
import Icon from "@/components/icon";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const CheckoutPayment = () => {
    return (
        <View style={{ gap: 10 }}>
            <TouchableOpacity style={[styles.addNoteButton, { borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }]}>
                <Icon icon={assets.icon.apple_pay} width={32} height={20} />
                <Text style={styles.addNoteText}>Apple pay</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addNoteButton, { borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }]}>
                <Icon icon={assets.icon.cash} size={24} />
                <Text style={styles.addNoteText}>Cash on delivery</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addNoteButton, { borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }]}>
                <Icon icon={assets.icon.momo} size={20} />
                <Text style={styles.addNoteText}>Momo</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>
        </View>
    )
}

export default CheckoutPayment;

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