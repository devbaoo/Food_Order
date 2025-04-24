import { getAllUserInfos } from "@/api/modules/user";
import assets from "@/assets";
import Banner from "@/components/banner";
import Modal from "@/components/modal";
import CartModal from "@/components/modal/cart";
import HomeCategory from "@/components/ui/home/home/category";
import HomeHeader from "@/components/ui/home/home/header";
import HomeReview from "@/components/ui/home/home/review";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { Info } from "@/types";
import screen from "@/utils/screen";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Image } from "react-native";

export default () => {
    const categories = [
        { id: 1, name: 'Fuits', icon: assets.item.fruit },
        { id: 2, name: 'Milk & egg', icon: assets.item.milk_egg },
        { id: 3, name: 'Beverages', icon: assets.item.beverage },
        { id: 4, name: 'Laundry', icon: assets.item.laundry },
        { id: 5, name: 'Vegetables', icon: assets.item.vegetable },
    ];

    const banners = [
        assets.banner.banner1,
        assets.banner.banner2,
        assets.banner.banner3
    ]

    const [users, setUsers] = useState<Info[]>([]);
    const [showAds, setShowAds] = useState<boolean>(false);
    const { cart, user } = useAuth();

    const onLoad = async () => {
        try {
            if(user)
            {
                const users = await getAllUserInfos(user.uid);
                setUsers(users);
            }
        }
        finally {

        }
    }

    useEffect(() => {
        setShowAds(true);
        onLoad();
    }, []);

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
                    <HomeReview reviews={users} />
                </ScrollView>
            </LinearGradient>

            <Modal
                wrapperStyle={{
                    backgroundColor: 'transparent',
                    flex: 0,
                    position: 'absolute',
                    top: screen.height / 3.5,
                    right: -screen.width / 10,
                }}
                containerStyle={{ zIndex: 3 }}
                visible={showAds}
                onCancel={() => setShowAds(false)}
            >
                <Image source={assets.ads.home_ads} style={{ height: screen.height / 4.23, resizeMode: 'contain' }} />
            </Modal>

            {cart && cart.cartItems.length > 0 && <CartModal cart={cart} />}
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