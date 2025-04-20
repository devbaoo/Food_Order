import assets from "@/assets";
import Icon from "@/components/icon";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const CheckoutDelivery = () => {
    return (
        <View style={{ borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }}>
            <TouchableOpacity style={styles.addNoteButton}>
                <Icon icon={assets.icon.priority} size={24} />
                <Text style={styles.addNoteText}>Priority (10 -20 mins)</Text>
                <Icon icon={assets.icon.unchecked} size={20} />
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={styles.addNoteButton}>
                <Icon icon={assets.icon.clock} size={24} />
                <Text style={styles.addNoteText}>Schedule</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>
        </View>
    )
}

export default CheckoutDelivery;

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