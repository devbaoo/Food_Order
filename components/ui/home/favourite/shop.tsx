import { getAllRestaurants } from "@/api/modules/restaurant";
import assets from "@/assets";
import { Restaurant } from "@/types";
import screen from "@/utils/screen";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Image, Text } from "react-native";

const FavouriteShop = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onLoad = async () => {
        try {
            setLoading(true);
            const restaurants = await getAllRestaurants();
            setRestaurants(restaurants);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBlock: 15, gap: 15 }
            }
        >
            {restaurants && restaurants.length > 0 && restaurants.map((item, index) => (
                <View style={[styles.shopCard, { width: '100%' }]} key={index.toString()}>
                    <View style={[styles.logoContainer, { maxHeight: 174, marginBottom: 12 }]}>
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: screen.width / 1.03, height: screen.height / 5.583 }}
                        />
                    </View>
                    < Text style={styles.shopLabel} >{item.name}</Text>
                    < View style={styles.ratingsContainer} >
                        <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default FavouriteShop;

const styles = StyleSheet.create({
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
})