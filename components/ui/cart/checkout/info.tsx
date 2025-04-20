import assets from "@/assets";
import Icon from "@/components/icon";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const CheckoutInfo = () => {
    return (
        <View style={{ borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }}>
        <TouchableOpacity style={styles.addNoteButton}>
            <Icon icon={assets.icon.user} size={24} />
            <Text style={styles.addNoteText}>Nguyen Trung Phu</Text>
            <Icon icon={assets.icon.chevron_right} size={16} />
        </TouchableOpacity>

        <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

        <TouchableOpacity style={styles.addNoteButton}>
            <Icon icon={assets.icon.phone} size={24} />
            <Text style={styles.addNoteText}>+84937848824</Text>
            <Icon icon={assets.icon.chevron_right} size={16} />
        </TouchableOpacity>
    </View>
    )
}

export default CheckoutInfo;

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