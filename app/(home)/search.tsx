import assets from "@/assets";
import Icon from "@/components/icon";
import SearchModal from "@/components/modal/search";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchScreen() {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1, position: 'relative' }}
            >
                <TouchableOpacity style={styles.searchContainer} onPress={() => setVisible(true)}>
                    <Icon icon={assets.icon.search} size={24} />
                    <Icon icon={assets.icon.dropdown} size={24} />
                    <Text style={{ fontSize: 25 }}>Search bar</Text>
                </TouchableOpacity>

                <SearchModal
                    visible={visible}
                    onClose={() => setVisible(false)}
                />
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30
    },

    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBlock: 15,
        paddingHorizontal: 12,
        marginTop: 15
    }
})