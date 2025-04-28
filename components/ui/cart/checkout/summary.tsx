import assets from "@/assets";
import Icon from "@/components/icon";
import { Cart } from "@/types";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Switch } from "react-native";

interface CheckoutSummaryProps {
    cart: Cart | null;
}

const CheckoutSummary:React.FC<CheckoutSummaryProps> = ({...props}) => {
    const {cart} = props;
    const [isRequire, setIsRequire] = useState<boolean>(false);
    
    return (
        <View style={{ borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }}>
            {/* Add Note */}
            <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Subtotal</Text>
                <Text>${cart?.totalPrice}</Text>
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Delivery</Text>
                <Text>$0</Text>
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Total</Text>
                <Text>${cart?.totalPrice}</Text>
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ececec' }} />

            <TouchableOpacity style={[styles.addNoteButton, isRequire && { backgroundColor: '#F6F6F6' }]}>
                <Text style={styles.addNoteText}>Request an invoice</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#00C0E2' }}
                    thumbColor={isRequire ? 'white' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setIsRequire(!isRequire)}
                    value={isRequire}
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