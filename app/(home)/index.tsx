import assets from "@/assets";
import Banner from "@/components/banner";
import HomeCategory from "@/components/ui/home/home/category";
import HomeHeader from "@/components/ui/home/home/header";
import HomeReview from "@/components/ui/home/home/review";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View, StyleSheet } from "react-native";

export default () => {
    const categories = [
        { id: 1, name: 'Fuits', icon: assets.item.fruit },
        { id: 2, name: 'Milk & egg', icon: assets.item.milk_egg },
        { id: 3, name: 'Beverages', icon: assets.item.beverage },
        { id: 4, name: 'Laundry', icon: assets.item.laundry },
        { id: 5, name: 'Vegetables', icon: assets.item.vegetable },
    ];

    const reviews = [
        { id: 1, name: 'User', rating: 5, image: assets.avatar.default_user },
        { id: 2, name: 'User', rating: 5, image: assets.avatar.default_user },
        { id: 3, name: 'User', rating: 5, image: assets.avatar.default_user },
    ];

    const banners = [
        assets.banner.banner1,
        assets.banner.banner2,
        assets.banner.banner3
    ]

    return (
        <View style={styles.container}>
            {/* Header */}
            <HomeHeader />

            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Banner */}
                    <View style={styles.bannerContainer}>
                        <Banner items={banners} />
                    </View>

                    {/* Categories */}
                    <HomeCategory categories={categories} />

                    {/* Reviews Section */}
                    <HomeReview reviews={reviews} />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },

    bannerContainer: {
        paddingBlock: 25
    },

});