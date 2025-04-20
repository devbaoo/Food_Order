import { AntDesign, Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const CartNote = () => {
    return (
        <View style={{ borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }}>
            {/* Add Note */}
            <TouchableOpacity style={styles.addNoteButton}>
                <Feather name="edit-2" size={20} color="black" />
                <Text style={styles.addNoteText}>Add Note</Text>
                <AntDesign name="right" size={16} color="grey" style={styles.addNoteArrow} />
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            {/* Delivery Fee */}
            <View style={styles.deliveryFeeContainer}>
                <View style={styles.deliveryFeeLeft}>
                    <Feather name="truck" size={20} color="black" />
                    <Text style={styles.deliveryFeeText}>Delivery</Text>
                </View>
                <Text style={styles.deliveryFeeAmount}>$6.00</Text>
            </View>
        </View>
    )
}

export default CartNote;

const styles = StyleSheet.create({
    addNoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    },
    addNoteText: {
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
    },
    addNoteArrow: {
        marginLeft: 'auto',
    },
    deliveryFeeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    deliveryFeeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryFeeText: {
        fontSize: 16,
        marginLeft: 10,
    },
    deliveryFeeAmount: {
        fontSize: 16,
        fontWeight: '500',
    },
})