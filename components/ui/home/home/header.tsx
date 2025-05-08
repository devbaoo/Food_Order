import assets from "@/assets";
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native"

const HomeHeader = () => {
    return (
        < View style={styles.header} >
            <View style={styles.locationContainer}>
                <Image source={assets.icon.delivery} style={{ width: 24, height: 24 }} />
                <Text style={styles.locationText}>S5.03, Vinhomes GrandParl</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#333" />
            </View>
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/(cart)')}>
                <Image source={assets.icon.cart} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
        </View >
    )
}

export default HomeHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    cartButton: {
        padding: 8,
    },
})