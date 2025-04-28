import { getAllCategories } from "@/api/modules/category";
import { getAllRestaurants } from "@/api/modules/restaurant";
import assets from "@/assets";
import Icon from "@/components/icon";
import BackgroundLoading from "@/components/loading/background";
import { Category, Restaurant } from "@/types";
import screen from "@/utils/screen";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text, ScrollView } from "react-native";

interface MenuStoreProps {
    onClose: () => void;
    selectedTime: string | null;
    selectedCategory: string | null;
    onSelect: (category: string) => void;
    blockBack?: boolean | null;
}

const MenuStore: React.FC<MenuStoreProps> = ({ ...prosp }) => {
    const { onClose, selectedTime, selectedCategory, onSelect, blockBack } = prosp;
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const scrollRef = useRef<ScrollView>(null);

    const onLoad = async () => {
        try {
            setLoading(true);
            const [restaurants, categories] = await Promise.all([
                getAllRestaurants(selectedCategory),
                getAllCategories(selectedTime)
            ]);
            setRestaurants(restaurants);
            setCategories(categories);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoad();
    }, [selectedCategory, selectedTime]);

    useEffect(() => {
        if (scrollRef.current && selectedCategory) {
          const index = categories.findIndex(item => item.id === selectedCategory);
          if (index >= 0) {
            const offset = (screen.width / 3.9 + 10) * index; // width + gap
            scrollRef.current.scrollTo({ x: offset, animated: true });
          }
        }
      }, [selectedCategory]);

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15, paddingTop: 20 }}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        categories.map((item, index) => (
                            <TouchableOpacity
                                style={{ gap: 5, backgroundColor: 'white', padding: 5, borderRadius: 10 }}
                                onPress={() => onSelect(item.id)}
                                key={index.toString()}
                                delayPressIn={100}
                            >
                                <Image source={{ uri: item.image }} style={{ width: screen.width / 3.9, height: screen.height / 6.38, borderRadius: 10 }} />
                                <Text>{item.name}</Text>
                                <Icon icon={assets.icon.dropdown} size={16} />
                                {
                                    selectedCategory !== item.id &&
                                    <View style={[StyleSheet.absoluteFill, { zIndex: 3, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10 }]} />
                                }
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>

            <View style={{ flex: 1, paddingHorizontal: 20, paddingBlock: 15 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, padding: 10 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ gap: 10 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            restaurants.map((item, index) => (
                                <TouchableOpacity
                                    style={{ backgroundColor: 'white', padding: 5, paddingBottom: 10, borderRadius: 10, gap: 5 }}
                                    onPress={() => router.push({
                                        pathname: '/(menu)', params: {
                                            restaurant: JSON.stringify(item)
                                        }
                                    })}
                                    key={index.toString()}
                                >
                                    <Image source={{ uri: item.image }} style={{ width: screen.width / 1.19, height: screen.height / 11.16, borderRadius: 5 }} />
                                    <Text>{item.name}</Text>
                                    <Icon icon={assets.icon.star} size={16} />
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>

            {
                !blockBack && (
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon icon={assets.icon.chevron_left_2} width={50} height={20} />
                    </TouchableOpacity>
                )
            }

            {loading && <BackgroundLoading />}
        </>
    )
}

export default MenuStore;

const styles = StyleSheet.create({
    closeButton: {
        paddingBlock: screen.width * 0.05,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
})