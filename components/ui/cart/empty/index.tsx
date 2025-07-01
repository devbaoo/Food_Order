import screen from "@/utils/screen"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { TFunction } from "i18next"
import React from "react"
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native"

export const EmptyCart = ({ t }: { t: TFunction<"translation", undefined> }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={18} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('app.cart')}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                <Image source={{ uri: "https://cdn2.iconfinder.com/data/icons/outline-web-application-1/20/cart-512.png" }} style={styles.icon} />
                <Text style={{ color: '#aaa', fontStyle: 'italic', fontSize: 16 }}>{t('app.your_cart_is_empty')}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    headerTitle: {
        fontSize: 20
    },
    icon: {
        width: screen.width * 0.3,
        height: screen.width * 0.3,
        tintColor: '#ccc'
    }
})