import screen from "@/utils/screen";
import React from "react";
import { useRef, useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Image } from "react-native";

const BannerCarousel = ({ banners, onBannerPress }: { banners: any[], onBannerPress: (banner: any, index: number) => void }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle scroll end to update current index
    const handleScrollEnd = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screen.width);
        setCurrentIndex(index);
    };

    // Auto scroll to next banner
    const scrollToNext = () => {
        const nextIndex = (currentIndex + 1) % banners.length;
        scrollViewRef.current?.scrollTo({
            x: nextIndex * screen.width,
            animated: true,
        });
        setCurrentIndex(nextIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
                style={styles.scrollView}
            >
                {banners.map((banner, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.bannerContainer}
                        onPress={() => onBannerPress && onBannerPress(banner, index)}
                    >
                        <Image source={banner} style={styles.bannerImage} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination dots */}
            <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default BannerCarousel;

const styles = StyleSheet.create({
    container: {
        height: 250, // Adjust height as needed
        marginVertical: 10,
    },
    scrollView: {
        flex: 1,
    },
    bannerContainer: {
        width: screen.width,
        paddingHorizontal: 15, // Add padding for spacing
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover', // or 'contain' based on your needs
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#007AFF',
    },
    inactiveDot: {
        backgroundColor: '#C4C4C4',
    },
    appContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
});