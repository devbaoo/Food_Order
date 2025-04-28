import assets from "@/assets";
import Icon from "@/components/icon";
import { Info } from "@/types";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

interface CheckoutAddressProps {
    info: Info | null;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({ ...props }) => {
    const { info } = props;

    return (
        <TouchableOpacity
            style={[styles.addNoteButton, { borderWidth: 1, borderColor: '#ECECEC', borderRadius: 10 }]}
            onPress={() => router.push("/(profile)")}
        >
            <Icon icon={assets.icon.location} size={24} />
            <View style={{ flex: 1, gap: 8 }}>
                <Text style={{ fontSize: 16 }}>{info?.address}</Text>
                <Text style={{ fontSize: 14 }}>{info?.provinceAddress}</Text>
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