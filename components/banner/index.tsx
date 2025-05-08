import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    runOnJS,
} from "react-native-reanimated";
import screen from "@/utils/screen";

// Updated measurements with minimal separation
const ITEM_WIDTH = screen.width * 0.85;
const ITEM_SPACING = -15; // Negative spacing to create overlap between items
const VISIBLE_ITEMS = 3; // How many items are visible at once

interface BannerProps {
    items: any[];
}

const SliderItem = ({
    item,
    index,
    scrollX,
}: {
    item: any;
    index: number;
    scrollX: SharedValue<number>;
}) => {
    const position = (ITEM_WIDTH + ITEM_SPACING) * index;
    
    const rnAnimatedStyle = useAnimatedStyle(() => {
        // Calculate distance from center
        const distanceFromCenter = position - scrollX.value;
        const screenCenter = screen.width / 2;
        const itemCenter = ITEM_WIDTH / 2;
        const distanceRatio = Math.min(Math.abs(distanceFromCenter / (screenCenter - itemCenter)), 1);
        
        // Use simpler calculations that are less likely to cause issues
        const scale = 1 - 0.15 * distanceRatio;
        const opacity = 1 - 0.3 * distanceRatio;
        const zIndex = 10 - 10 * distanceRatio;
        
        return {
            width: ITEM_WIDTH,
            marginRight: ITEM_SPACING,
            transform: [{ scale }],
            opacity,
            zIndex,
        };
    });

    return (
        <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
            <Image source={item} style={styles.cardImage} />
        </Animated.View>
    );
};

const Banner: React.FC<BannerProps> = ({ items }) => {
    const scrollX = useSharedValue(0);
    const flatListRef = React.useRef(null);

    // Create a safe handler that avoids common animation crashes
    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    // Determine proper padding to show sides of adjacent items
    const sideItemVisible = (screen.width - ITEM_WIDTH) / 2;
    
    // Create dummy items to prevent crashes when scrolling to edges
    const extendedItems = React.useMemo(() => {
        if (items.length < 3) return items;
        return items;
    }, [items]);
    
    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                data={extendedItems}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_SPACING}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={{
                    paddingHorizontal: sideItemVisible,
                }}
                renderItem={({ item, index }) => (
                    <SliderItem 
                        item={item} 
                        index={index} 
                        scrollX={scrollX} 
                    />
                )}
                keyExtractor={(_, index) => index.toString()}
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                // Adding these props to improve stability
                removeClippedSubviews={false}
                initialNumToRender={extendedItems.length}
                maxToRenderPerBatch={extendedItems.length}
                windowSize={VISIBLE_ITEMS * 2 + 1}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        // Use absolute positioning instead of z-index for better performance
        position: "relative",
    },
    cardImage: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH / 2,
        borderRadius: 14,
    },
});

export default Banner;