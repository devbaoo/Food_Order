import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import screen from "@/utils/screen";

// Updated measurements with minimal separation
const ITEM_WIDTH = screen.width * 0.85;
const ITEM_SPACING = -15; // Negative spacing to create overlap between items

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
    const inputRange = [
        (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
        index * (ITEM_WIDTH + ITEM_SPACING),
        (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
    ];

    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: ITEM_WIDTH,
            marginRight: ITEM_SPACING, // This creates the overlap effect
            transform: [
                {
                    scale: interpolate(
                        scrollX.value,
                        inputRange,
                        [0.85, 1, 0.85],
                        Extrapolation.CLAMP
                    ),
                },
            ],
            opacity: interpolate(
                scrollX.value,
                inputRange,
                [0.7, 1, 0.7],
                Extrapolation.CLAMP
            ),
            zIndex: interpolate(
                scrollX.value,
                inputRange,
                [0, 10, 0],
                Extrapolation.CLAMP
            ), // Higher z-index for center item
        };
    });

    return (
        <Animated.View style={[rnAnimatedStyle]}>
            <Image source={item} style={styles.cardImage} />
        </Animated.View>
    );
};

const Banner: React.FC<BannerProps> = ({ items }) => {
    const scrollX = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        },
    });

    // Calculate the visible width of side items
    const sideItemVisible = (screen.width - ITEM_WIDTH) / 2;
    
    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_SPACING}
                decelerationRate={0.8}
                bounces={false}
                contentContainerStyle={{
                    paddingHorizontal: sideItemVisible,
                }}
                renderItem={({ item, index }) => (
                    <SliderItem item={item} index={index} scrollX={scrollX} />
                )}
                keyExtractor={(_, index) => index.toString()}
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardImage: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH / 2,
        borderRadius: 14,
    },
});

export default Banner;