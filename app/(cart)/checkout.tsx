import CheckoutAddress from "@/components/ui/cart/checkout/address";
import CheckoutCounpon from "@/components/ui/cart/checkout/counpon";
import CheckoutDelivery from "@/components/ui/cart/checkout/delivery";
import CheckoutHeader from "@/components/ui/cart/checkout/header";
import CheckoutInfo from "@/components/ui/cart/checkout/info";
import CheckoutPayment from "@/components/ui/cart/checkout/payment";
import CheckoutSummary from "@/components/ui/cart/checkout/summary";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function CheckoutScreen() {
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 15, paddingBottom: 20, paddingHorizontal: 16, }}
            >
                {/* Header */}
                <CheckoutHeader />

                {/* Info */}
                <CheckoutInfo />

                <Text style={styles.title}>Address</Text>

                {/* Address */}
                <CheckoutAddress />

                <Text style={styles.title}>Have counpon?</Text>

                {/* Counpon */}
                <CheckoutCounpon />

                <Text style={styles.title}>Delivery</Text>

                {/* Delivery */}
                <CheckoutDelivery />

                <Text style={styles.title}>Order Summary (2 items)</Text>

                {/* Summary */}
                <CheckoutSummary />

                <Text style={styles.title}>Payment method</Text>

                {/* Payment Method */}
                <CheckoutPayment />
            </ScrollView>

            <View style={{
                paddingTop: 15,
                paddingBottom: 30,
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 9,
                },
                shadowOpacity: 0.50,
                shadowRadius: 12.35,
                backgroundColor: 'white',
                elevation: 19,
            }}>
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32,
    },

    title: {
        fontSize: 16,
        paddingHorizontal: 15
    },

    submitButton: {
        backgroundColor: '#00C0E2',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        paddingBlock: 15
    }
})