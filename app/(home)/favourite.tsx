import assets from "@/assets";
import screen from "@/utils/screen";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

export default function FavouriteScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Most Purchases</Text>
                        <Text style={styles.seeAll}>See all</Text>
                    </View>

                    {/* Shop Cards */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, paddingHorizontal: 10 }}
                    >
                        {/* World Food Shop */}
                        <View style={styles.shopCard}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={assets.shop.shop1}
                                    style={[{ width: 160, height: 174 }]}
                                />
                            </View>
                            <Text style={styles.shopLabel}>Shop</Text>
                            <View style={styles.ratingsContainer}>
                                <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                                <Text style={styles.ratingsText}>Ratings</Text>
                            </View>
                        </View>

                        {/* Food Shop */}
                        <View style={styles.shopCard}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={assets.shop.shop2}
                                    style={{ width: 160, height: 174 }}
                                />
                            </View>
                            <Text style={styles.shopLabel}>Shop</Text>
                            <View style={styles.ratingsContainer}>
                                <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                                <Text style={styles.ratingsText}>Ratings</Text>
                            </View>
                        </View>

                        {/* Third Shop (partially visible) */}
                        <View style={styles.shopCard}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={assets.shop.shop2}
                                    style={{ width: 160, height: 174 }}
                                />
                            </View>
                            <Text style={styles.shopLabel}>Shop</Text>
                            <View style={styles.ratingsContainer}>
                                <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                                <Text style={styles.ratingsText}>Ratings</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={{
                        width: '100%',
                        height: 150,
                        backgroundColor: 'rgba(255, 255, 255, 0.33)',
                        marginBlock: 15,
                        borderRadius: 20
                    }}
                    />

                    {/* Section Header */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Shops</Text>
                    </View>

                    {/* Banner */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBlock: 15, gap: 15 }}
                    >
                        <View style={[styles.shopCard, { width: '100%' }]}>
                            <View style={[styles.logoContainer, { maxHeight: 174, marginBottom: 12 }]}>
                                <Image
                                    source={assets.banner.banner1}
                                    style={{ width: '100%', resizeMode: 'contain' }}
                                />
                            </View>
                            <Text style={styles.shopLabel}>Shopname</Text>
                            <View style={styles.ratingsContainer}>
                                <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                            </View>
                        </View>
                        <View style={[styles.shopCard, { width: '100%' }]}>
                            <View style={[styles.logoContainer, { maxHeight: 174, marginBottom: 12 }]}>
                                <Image
                                    source={assets.banner.banner1}
                                    style={{ width: '100%', resizeMode: 'contain' }}
                                />
                            </View>
                            <Text style={styles.shopLabel}>Shopname</Text>
                            <View style={styles.ratingsContainer}>
                                <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                            </View>
                        </View>
                        <View style={[styles.shopCard, { width: '100%' }]}>
                            <View style={[styles.logoContainer, { maxHeight: 174, marginBottom: 12 }]}>
                                <Image
                                    source={assets.banner.banner1}
                                    style={{ width: '100%', resizeMode: 'contain' }}
                                />
                            </View>
                            <Text style={styles.shopLabel}>Shopname</Text>
                            <View style={styles.ratingsContainer}>
                                <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                            </View>
                        </View>
                    </ScrollView>
                </ScrollView>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: 'white'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    seeAll: {
        fontSize: 14,
        color: '#00BCD4',
    },
    shopCard: {
        height: screen.height / 3.8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    logoContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        overflow: 'hidden'
    },
    cartLogoContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
    },
    shopSubtitle: {
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
    },
    shopLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    ratingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingsText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center'
    },
    bannerContainer: {
        paddingHorizontal: 16,
        marginTop: 15,
    },
    banner: {
        height: 100,
        backgroundColor: '#FFD700',
        borderRadius: 10,
        padding: 10,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    bannerTextContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    loremText: {
        fontSize: 10,
        color: '#333',
        fontWeight: '600',
    },
    bannerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    fastFoodText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#FF6347',
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
    },
    foodText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 2,
    },
    bonAppetitText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#333',
    },
    foodImagesContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    shopnameContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    shopnameText: {
        fontSize: 16,
        fontWeight: '500',
    },
    underline: {
        height: 2,
        width: 40,
        backgroundColor: '#00BCD4',
        marginTop: 4,
    },
});