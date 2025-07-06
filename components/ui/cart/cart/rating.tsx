import screen from "@/utils/screen";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export const RateOrderScreen = ({ ...props }) => {
    const { pagerRef, loading, restaurantName, review, setStar, star, t } = props;

    return (
        <View style={styles.flex1BgGray50}>
            {/* Header with gray background */}
            <Image source={{ uri: "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner.jpg" }} style={styles.rateHeader} />

            <View style={styles.rateContent}>
                <Text style={styles.rateTitle}>
                    {t("app.enjoy_your_meal")}
                </Text>

                <View style={styles.rateSection}>
                    {loading ?
                        <View style={styles.rateImage} />
                        :
                        <Image source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4_ujwdtIghyTGEbxYYADIMUUxS2e9DBI7Juqa5E4lh3uApfs6Cah8iGfbPnar6pHQaf8&usqp=CAU" }} style={styles.rateImage} />
                    }
                    <Text style={styles.rateText}>
                        {t("app.how_do_you_rate_order_from", { name: loading ? "Loading..." : restaurantName })}
                    </Text>

                    {/* Star Rating */}
                    <View style={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setStar(item)}
                            >
                                <AntDesign
                                    name={item <= star ? "star" : "staro"}
                                    size={32}
                                    color={item <= star ? "#FFD700" : "#D1D5DB"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{ marginTop: 'auto' }}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => pagerRef.current?.setPage(1)}
                    >
                        <Text style={styles.submitButtonText}>{review ? t("app.continue") : t("app.send")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.laterButton}
                        onPress={() => router.push("/(home)")}
                    >
                        <Text style={styles.laterButtonText}>{t("app.later")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    flex1BgGray50: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    rateHeader: {
        backgroundColor: '#D1D5DB',
        height: screen.height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateHeaderImage: {
        width: 80,
        height: 80,
        backgroundColor: '#9CA3AF',
        borderRadius: 8,
    },
    rateContent: {
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
    },
    rateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F97316',
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: '70%',
        alignSelf: 'center'
    },
    rateSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    rateImage: {
        width: 64,
        height: 64,
        backgroundColor: '#D1D5DB',
        borderRadius: 8,
        marginBottom: 16,
    },
    rateText: {
        textAlign: 'center',
        color: '#374151',
        marginBottom: 8,
    },
    starContainer: {
        flexDirection: 'row',
        gap: 8,
    },

    submitButton: {
        backgroundColor: '#F97316',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
    laterButton: {
        backgroundColor: '#E5E7EB',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    laterButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
})