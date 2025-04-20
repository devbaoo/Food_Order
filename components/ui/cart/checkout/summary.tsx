import assets from "@/assets";
import Icon from "@/components/icon";
import { StyleSheet, TouchableOpacity, View, Text, Switch } from "react-native";

const CheckoutSummary = () => {
    return (
        <View style={{ borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }}>
            {/* Add Note */}
            <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Subtotal</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Delivery</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Total</Text>
                <Icon icon={assets.icon.chevron_right} size={16} />
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={[styles.addNoteButton, { backgroundColor: '#F6F6F6' }]}>
                <Text style={styles.addNoteText}>Request an invoice</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#00C0E2' }}
                    thumbColor={true ? 'white' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => { }}
                    value={true}
                    style={{ height: 20 }}
                />
            </TouchableOpacity>
        </View>
    )
}

export default CheckoutSummary;

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