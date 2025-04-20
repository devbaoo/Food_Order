import { AntDesign } from "@expo/vector-icons";
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
                <Image
                    source={{ uri: 'https://via.placeholder.com/80' }}
                    style={styles.recommendedImage}
                />
                <View style={styles.recommendedDetails}>
                    <Text style={styles.recommendedName}>Purex</Text>
                    <View style={styles.ratingContainer}>
                        <AntDesign name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8 (287)</Text>
                    </View>
                    <Text style={styles.recommendedPrice}>$1</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                    <AntDesign name="plus" size={20} color="black" />
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 1)'
    },
    recommendedImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
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
    },
})