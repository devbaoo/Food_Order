import { StyleSheet, View, Text } from "react-native";

const CartDeliveryProgress = () => {
    return (
        <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>You are $1 away from free delivery</Text>
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarFilled} />
                <View style={styles.progressBarEmpty} />
            </View>
        </View>
    )
}

export default CartDeliveryProgress;

const styles = StyleSheet.create({
    deliveryInfo: {
        marginVertical: 20,
        marginBottom: 40
    },
    deliveryText: {
        fontSize: 15,
        marginBottom: 15,
        textAlign: 'center'
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        flexDirection: 'row',
    },
    progressBarFilled: {
        flex: 7,
        backgroundColor: '#00BCD4',
        borderRadius: 3,
    },
    progressBarEmpty: {
        flex: 3,
    },
})