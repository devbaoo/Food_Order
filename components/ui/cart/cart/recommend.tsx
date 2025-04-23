import assets from "@/assets";
import Icon from "@/components/icon";
import screen from "@/utils/screen";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

const CartRecommendItem = () => {
    return (
        <View style={styles.recommendedSection}>
            <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedTitle}>Recommended for you</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.recommendedItem}>
                <View style={{ width: screen.width / 2.6875, height: screen.height / 6.38, borderRadius: 10, backgroundColor: '#F6F6F6', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={assets.food.nuoccam}
                        style={styles.recommendedImage}
                    />
                    <TouchableOpacity style={styles.addButton}>
                        <Icon icon={assets.icon.plus} size={18} />
                    </TouchableOpacity>
                </View>
                <View style={styles.recommendedDetails}>
                    <Text style={styles.recommendedName}>Purex</Text>
                    <View style={styles.ratingContainer}>
                        <AntDesign name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8 (287)</Text>
                    </View>
                    <Text style={styles.recommendedPrice}>$1</Text>
                </View>

            </View>
        </View>
    )
}

export default CartRecommendItem;

const styles = StyleSheet.create({
    recommendedSection: {
        marginBottom: 20,
    },
    recommendedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    recommendedTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    seeAllText: {
        fontSize: 14,
        color: '#00BCD4',
    },
    recommendedItem: {
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6
    },
    recommendedImage: {
        width: screen.width / 3.467,
        height: screen.height / 6.38,
    },
    recommendedDetails: {
        flex: 1,
        paddingHorizontal: 12,
    },
    recommendedName: {
        fontSize: 16,
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    ratingText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    recommendedPrice: {
        fontSize: 15,
        fontWeight: '500',
    },
    addButton: {
        padding: 8,
        position: 'absolute',
        backgroundColor: 'white',
        bottom: 5,
        right: 5,
        borderRadius: screen.width
    },
})